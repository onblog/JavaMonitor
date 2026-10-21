/**
 * WOFF 1.0 容器编解码。
 *
 * WOFF 的模型很简单：把一个 sfnt(ttf/otf) 的每张表分别做 zlib 压缩，
 * 再套一层自己的文件头和表目录。因此不需要任何第三方库 ——
 * 浏览器原生的 CompressionStream / DecompressionStream 就是 zlib。
 *
 * 注意这里是「容器层」转换：只换外壳，字形轮廓（glyf / CFF）原封不动。
 */

const WOFF_SIGNATURE = 0x774f4646; // 'wOFF'
const HEADER_SIZE = 44;
const ENTRY_SIZE = 20;

/**
 * 通过文件头判断是不是 WOFF 容器
 * @param {Uint8Array} bytes
 */
export function isWoff(bytes) {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x77 &&
    bytes[1] === 0x4f &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  );
}

function assertStreamSupport() {
  if (typeof DecompressionStream === 'undefined' || typeof CompressionStream === 'undefined') {
    throw new Error(
      '当前浏览器不支持 CompressionStream，无法处理 woff 格式。建议换用最新版浏览器，或直接使用 woff2。'
    );
  }
}

/**
 * zlib 解压（WOFF 表数据用的就是 zlib 流）
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function inflate(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * zlib 压缩
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function deflate(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** sfnt 目录里的 searchRange / entrySelector / rangeShift 三个派生字段 */
function searchFields(numTables) {
  const entrySelector = Math.floor(Math.log2(Math.max(1, numTables)));
  const searchRange = 16 * 2 ** entrySelector;
  return { searchRange, entrySelector, rangeShift: 16 * numTables - searchRange };
}

function tagToString(tag) {
  return String.fromCharCode((tag >>> 24) & 0xff, (tag >>> 16) & 0xff, (tag >>> 8) & 0xff, tag & 0xff);
}

/**
 * 把一组表重新组装成 sfnt(ttf/otf) 字节。
 * sfnt 要求表目录按 tag 升序、表数据 4 字节对齐。
 *
 * @param {number} flavor sfnt version
 * @param {Array<{tag:number,data:Uint8Array,origLength:number,origChecksum:number}>} tables
 * @returns {Uint8Array}
 */
function buildSfnt(flavor, tables) {
  const sorted = [...tables].sort((a, b) => a.tag - b.tag);
  const numTables = sorted.length;
  const headerSize = 12 + numTables * 16;

  let cursor = headerSize;
  const layout = sorted.map((table) => {
    const offset = cursor;
    cursor += (table.data.length + 3) & ~3; // 每张表按 4 字节对齐
    return { ...table, offset };
  });

  const out = new Uint8Array(cursor);
  const view = new DataView(out.buffer);
  const { searchRange, entrySelector, rangeShift } = searchFields(numTables);

  view.setUint32(0, flavor);
  view.setUint16(4, numTables);
  view.setUint16(6, searchRange);
  view.setUint16(8, entrySelector);
  view.setUint16(10, rangeShift);

  layout.forEach((table, i) => {
    const base = 12 + i * 16;
    view.setUint32(base, table.tag);
    view.setUint32(base + 4, table.origChecksum);
    view.setUint32(base + 8, table.offset);
    view.setUint32(base + 12, table.origLength);
    out.set(table.data, table.offset);
  });

  return out;
}

/**
 * WOFF → sfnt
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
export async function decodeWoff(bytes) {
  if (!isWoff(bytes)) throw new Error('不是 WOFF 文件');
  if (bytes.length < HEADER_SIZE) throw new Error('WOFF 文件头不完整，文件可能已损坏');
  assertStreamSupport();

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const flavor = view.getUint32(4);
  const numTables = view.getUint16(12);

  if (numTables === 0) throw new Error('WOFF 表数量为 0，文件已损坏');
  if (HEADER_SIZE + numTables * ENTRY_SIZE > bytes.length) {
    throw new Error('WOFF 表目录越界，文件可能已损坏');
  }

  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const base = HEADER_SIZE + i * ENTRY_SIZE;
    const tag = view.getUint32(base);
    const offset = view.getUint32(base + 4);
    const compLength = view.getUint32(base + 8);
    const origLength = view.getUint32(base + 12);
    const origChecksum = view.getUint32(base + 16);

    if (offset + compLength > bytes.length) {
      throw new Error(`WOFF 表 ${tagToString(tag)} 越界，文件可能已损坏`);
    }

    let data = bytes.subarray(offset, offset + compLength);
    // 规范：compLength 等于 origLength 表示这张表是原样存储的
    if (compLength !== origLength) data = await inflate(data);

    if (data.length !== origLength) {
      throw new Error(`WOFF 表 ${tagToString(tag)} 解压后长度不符（期望 ${origLength}，实际 ${data.length}）`);
    }

    tables.push({ tag, data, origLength, origChecksum });
  }

  return buildSfnt(flavor, tables);
}

/**
 * sfnt → WOFF
 * @param {Uint8Array} sfnt
 * @returns {Promise<Uint8Array>}
 */
export async function encodeWoff(sfnt) {
  assertStreamSupport();

  const view = new DataView(sfnt.buffer, sfnt.byteOffset, sfnt.byteLength);
  const flavor = view.getUint32(0);
  const numTables = view.getUint16(4);
  if (numTables === 0 || numTables > 512) {
    throw new Error('sfnt 表数量异常，无法转换为 woff');
  }

  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const base = 12 + i * 16;
    const tag = view.getUint32(base);
    const checksum = view.getUint32(base + 4);
    const offset = view.getUint32(base + 8);
    const length = view.getUint32(base + 12);
    tables.push({ tag, checksum, origLength: length, raw: sfnt.subarray(offset, offset + length) });
  }

  const packed = [];
  for (const table of tables) {
    const compressed = await deflate(table.raw);
    // 压缩后没变小就原样存，避免 woff 反而变大
    const data = compressed.length < table.origLength ? compressed : table.raw;
    packed.push({ ...table, data });
  }

  let cursor = HEADER_SIZE + numTables * ENTRY_SIZE;
  for (const entry of packed) {
    entry.offset = cursor;
    cursor += (entry.data.length + 3) & ~3;
  }
  const totalLength = cursor;

  const out = new Uint8Array(totalLength);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, WOFF_SIGNATURE);
  outView.setUint32(4, flavor);
  outView.setUint32(8, totalLength);
  outView.setUint16(12, numTables);
  outView.setUint16(14, 0); // reserved
  outView.setUint32(16, sfnt.byteLength); // totalSfntSize
  // 20..43 为 majorVersion / minorVersion / meta* / priv*，全部保持 0

  packed.forEach((entry, i) => {
    const base = HEADER_SIZE + i * ENTRY_SIZE;
    outView.setUint32(base, entry.tag);
    outView.setUint32(base + 4, entry.offset);
    outView.setUint32(base + 8, entry.data.length);
    outView.setUint32(base + 12, entry.origLength);
    outView.setUint32(base + 16, entry.checksum);
    out.set(entry.data, entry.offset);
  });

  return out;
}
