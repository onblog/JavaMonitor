/**
 * harfbuzz hb-subset 的浏览器端封装
 *
 * 移植自 subset-font（BSD-3-Clause）的核心逻辑，去掉 Node 依赖：
 * 直接 instantiate harfbuzzjs 提供的 harfbuzz-subset.wasm。
 */

const WASM_URL = new URL('../../wasm/harfbuzz-subset.wasm', import.meta.url).href;

const HB_MEMORY_MODE_WRITABLE = 2;
const HB_SUBSET_SETS_DROP_TABLE_TAG = 3;
const HB_SUBSET_SETS_NAME_ID = 4;
const HB_SUBSET_SETS_LAYOUT_FEATURE_TAG = 6;
const HB_SUBSET_FLAGS_NO_HINTING = 0x00000001;
const HB_SUBSET_FLAGS_GLYPH_NAMES = 0x00000080;
const HB_SUBSET_FLAGS_NO_LAYOUT_CLOSURE = 0x00000200;

function HB_TAG(str) {
  return str
    .split('')
    .reduce((acc, ch) => (acc << 8) + ch.charCodeAt(0), 0);
}

let harfbuzzPromise = null;

export function loadHarfbuzz() {
  if (!harfbuzzPromise) {
    harfbuzzPromise = (async () => {
      const res = await fetch(WASM_URL);
      if (!res.ok) {
        throw new Error(`无法加载 harfbuzz wasm（HTTP ${res.status}）`);
      }
      const bytes = await res.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes);
      const hb = instance.exports;
      if (typeof hb._initialize !== 'function') {
        throw new Error('harfbuzz wasm 缺少 _initialize 导出');
      }
      hb._initialize();
      return hb;
    })().catch((err) => {
      harfbuzzPromise = null;
      throw err;
    });
  }
  return harfbuzzPromise;
}

/**
 * 按字符集裁剪一个 sfnt（ttf/otf）字体
 *
 * @param {Uint8Array} sfnt   原始 sfnt 字节
 * @param {string} text       需要保留的字符
 * @param {object} [options]
 * @param {boolean} [options.noHinting]  去掉 hinting 指令，通常可再省 3%~10%
 * @param {boolean} [options.glyphNames] 保留 glyph 名字
 * @returns {Promise<Uint8Array>} 裁剪后的 sfnt
 */
export async function subsetSfnt(sfnt, text, options = {}) {
  const hb = await loadHarfbuzz();

  // wasm 内存增长会使旧视图失效，每次使用前都重新取
  const heap = () => new Uint8Array(hb.memory.buffer);

  const input = hb.hb_subset_input_create_or_fail();
  if (input === 0) {
    throw new Error('harfbuzz 无法创建 subset input');
  }

  const fontPtr = hb.malloc(sfnt.byteLength);
  if (fontPtr === 0) {
    hb.hb_subset_input_destroy(input);
    throw new Error('内存不足：字体太大，当前浏览器无法完成裁剪');
  }

  let face = 0;
  let subset = 0;
  let result = 0;

  try {
    heap().set(sfnt, fontPtr);

    const blob = hb.hb_blob_create(
      fontPtr,
      sfnt.byteLength,
      HB_MEMORY_MODE_WRITABLE,
      0,
      0
    );
    face = hb.hb_face_create(blob, 0);
    hb.hb_blob_destroy(blob);

    if (face === 0) {
      throw new Error('harfbuzz 无法解析该字体，请确认它是有效的 ttf/otf');
    }

    // 默认保留全部 OpenType layout features（等价 CLI 的 --layout-features=*）
    const layoutFeatures = hb.hb_subset_input_set(
      input,
      HB_SUBSET_SETS_LAYOUT_FEATURE_TAG
    );
    hb.hb_set_clear(layoutFeatures);
    hb.hb_set_invert(layoutFeatures);

    let flags = hb.hb_subset_input_get_flags(input);
    if (options.noHinting) flags |= HB_SUBSET_FLAGS_NO_HINTING;
    if (options.glyphNames) flags |= HB_SUBSET_FLAGS_GLYPH_NAMES;
    if (options.noLayoutClosure) flags |= HB_SUBSET_FLAGS_NO_LAYOUT_CLOSURE;
    if (flags !== hb.hb_subset_input_get_flags(input)) {
      hb.hb_subset_input_set_flags(input, flags);
    }

    const unicodes = hb.hb_subset_input_unicode_set(input);
    for (const ch of text) {
      hb.hb_set_add(unicodes, ch.codePointAt(0));
    }

    subset = hb.hb_subset_or_fail(face, input);
    if (subset === 0) {
      throw new Error('裁剪失败：字体文件可能已损坏，或不包含任何可用字形');
    }

    result = hb.hb_face_reference_blob(subset);
    const length = hb.hb_blob_get_length(result);
    if (length === 0) {
      throw new Error('裁剪结果为空');
    }
    const offset = hb.hb_blob_get_data(result, 0);
    // 必须在任何可能增长内存的操作前拷贝出来
    return new Uint8Array(heap().subarray(offset, offset + length));
  } finally {
    if (result !== 0) hb.hb_blob_destroy(result);
    if (subset !== 0) hb.hb_face_destroy(subset);
    if (face !== 0) hb.hb_face_destroy(face);
    hb.free(fontPtr);
    hb.hb_subset_input_destroy(input);
  }
}
