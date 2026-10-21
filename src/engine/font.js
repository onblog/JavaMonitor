import { subsetSfnt } from './harfbuzz.js';
import { compress, decompress } from './woff2.js';
import { decodeWoff, encodeWoff } from './woff.js';

/**
 * 容器格式。sfnt 家族细分成 ttf / otf，方便界面如实告知用户手里是什么。
 * @typedef {'ttf'|'otf'|'woff'|'woff2'} FontFormat
 * @typedef {'ttf'|'otf'} BaseFormat 解压后 sfnt 的容器类型（也是轮廓类型的表象）
 */

/** 所有可以输出的容器格式，顺序即界面展示顺序 */
export const OUTPUT_FORMATS = ['ttf', 'woff', 'woff2'];

export const FORMAT_LABEL = {
  ttf: 'ttf',
  otf: 'otf',
  woff: 'woff',
  woff2: 'woff2',
};

/**
 * 通过文件头魔数识别字体格式
 * @param {Uint8Array} bytes
 * @returns {FontFormat|null}
 */
export function detectFormat(bytes) {
  if (!bytes || bytes.length < 4) return null;
  const [a, b, c, d] = bytes;
  if (a === 0x77 && b === 0x4f && c === 0x46 && d === 0x46) return 'woff';
  if (a === 0x77 && b === 0x4f && c === 0x46 && d === 0x32) return 'woff2';
  if (a === 0x74 && b === 0x72 && c === 0x75 && d === 0x65) return 'ttf'; // 'true'，Apple 老式 TrueType
  if (a === 0x4f && b === 0x54 && c === 0x54 && d === 0x4f) return 'otf'; // 'OTTO'，CFF 轮廓
  if (a === 0x00 && b === 0x01 && c === 0x00 && d === 0x00) return 'ttf'; // 标准 TrueType
  return null;
}

/**
 * 读 sfnt 头的版本号，判断解压后是 ttf 还是 otf。
 * 注意：woff / woff2 的容器类型要解压后才知道，所以单独判断。
 * @param {Uint8Array} sfnt
 * @returns {BaseFormat}
 */
export function sfntBase(sfnt) {
  return flavorToBase(((sfnt[0] << 24) | (sfnt[1] << 16) | (sfnt[2] << 8) | sfnt[3]) >>> 0);
}

const OTTO = 0x4f54544f;

/** @param {number} tag @returns {BaseFormat} */
function flavorToBase(tag) {
  return tag === OTTO ? 'otf' : 'ttf';
}

/**
 * 不解压也能判断字体家族：woff / woff2 文件头的第 4–7 字节就是 sfnt flavor，
 * 这样选完文件就能把输出选项标成正确的格式，不用先跑一遍解码。
 * @param {Uint8Array} bytes
 * @param {FontFormat} format
 * @returns {BaseFormat}
 */
export function peekBase(bytes, format) {
  if (format === 'ttf' || format === 'otf') return format;
  if (bytes.length < 8) return 'ttf';
  return flavorToBase(((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7]) >>> 0);
}

/**
 * 统一转成 sfnt（harfbuzz 与后续容器编码都只接受 sfnt 字节）
 * @param {Uint8Array} bytes
 * @param {FontFormat} [format]
 * @returns {Promise<Uint8Array>}
 */
export async function toSfnt(bytes, format = detectFormat(bytes)) {
  if (format === 'ttf' || format === 'otf') return bytes;
  if (format === 'woff2') return decompress(bytes);
  if (format === 'woff') return decodeWoff(bytes);
  throw new Error('无法识别的字体格式，请确认文件是 ttf / otf / woff / woff2');
}

/**
 * 把 sfnt 写成目标容器格式
 * @param {Uint8Array} sfnt
 * @param {FontFormat} format
 * @returns {Promise<Uint8Array>}
 */
export async function writeFont(sfnt, format) {
  if (format === 'ttf' || format === 'otf') return sfnt;
  if (format === 'woff2') return compress(sfnt);
  if (format === 'woff') return encodeWoff(sfnt);
  throw new Error(`不支持的输出格式：${format}`);
}

/**
 * 读字体：得到 sfnt 字节 + 容器类型 + 解压后的家族（ttf / otf）
 * @param {Uint8Array} bytes
 */
export async function readFont(bytes) {
  const format = detectFormat(bytes);
  if (!format) {
    throw new Error('无法识别的字体格式，请确认文件是 ttf / otf / woff / woff2');
  }
  const sfnt = await toSfnt(bytes, format);
  return { sfnt, format, base: sfntBase(sfnt) };
}

/**
 * 输出格式归一：ttf / otf 二选一时，以字体本身的轮廓家族为准。
 * 例如源文件是 otf，用户在界面上勾「原格式」，这里应该给出 otf 而不是 ttf。
 * @param {BaseFormat} base
 * @param {FontFormat[]} formats
 */
export function resolveFormats(base, formats) {
  return formats.map((f) => (f === 'ttf' || f === 'otf' ? base : f));
}

/**
 * 按字符集裁剪字体，并生成目标容器格式
 *
 * @param {Uint8Array} bytes 原始字体
 * @param {string} text 需要保留的字符
 * @param {{ formats?: FontFormat[], noHinting?: boolean }} [options]
 */
export async function subsetFont(bytes, text, options = {}) {
  const { formats = ['woff2', 'ttf'], noHinting = false } = options;

  const chars = [...new Set([...text])].join('');
  if (chars.length === 0) {
    throw new Error('字符集为空，请先输入或从页面提取需要保留的文字');
  }

  const started = performance.now();
  const font = await readFont(bytes);
  const subsetted = await subsetSfnt(font.sfnt, chars, { noHinting });
  const base = sfntBase(subsetted);

  /** @type {Record<string, Uint8Array>} */
  const outputs = {};
  for (const format of resolveFormats(base, formats)) {
    outputs[format] = await writeFont(subsetted, format);
  }

  return {
    mode: 'compress',
    inputFormat: font.format,
    base,
    chars: chars.length,
    outputs,
    elapsed: performance.now() - started,
  };
}

/**
 * 容器格式转换：不做裁剪，只换外壳。
 * 支持 ttf/otf/woff/woff2 任意输入，输出 woff / woff2 / 原格式。
 *
 * @param {Uint8Array} bytes
 * @param {FontFormat[]} formats
 */
export async function convertFont(bytes, formats = ['woff2']) {
  const started = performance.now();
  const font = await readFont(bytes);

  /** @type {Record<string, Uint8Array>} */
  const outputs = {};
  for (const format of resolveFormats(font.base, formats)) {
    outputs[format] = await writeFont(font.sfnt, format);
  }

  return {
    mode: 'convert',
    inputFormat: font.format,
    base: font.base,
    outputs,
    elapsed: performance.now() - started,
  };
}
