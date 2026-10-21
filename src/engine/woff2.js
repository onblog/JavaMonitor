/**
 * WOFF2 编解码（浏览器端）
 *
 * wawoff2 的 emscripten 产物只在 Node 分支执行 `module.exports = Module`，
 * 在浏览器里直接 import 拿不到 compress/decompress，因此这里用 Function 构造
 * 一个隔离作用域执行源码，并显式把内部的 `Module` 对象返回出来。
 * wasm 已内联为 base64 data URI，不依赖 fs / 网络。
 */

const WASM_BASE = new URL('../../wasm/', import.meta.url);

const BINDINGS = {
  compress: new URL('woff2-compress.js', WASM_BASE).href,
  decompress: new URL('woff2-decompress.js', WASM_BASE).href,
};

const cache = new Map();

function isObjectLike(value) {
  return value !== null && typeof value === 'object';
}

async function instantiate(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`无法加载 ${url}（HTTP ${res.status}）`);
  }
  const source = await res.text();

  const factory = new Function(
    'module',
    'exports',
    'require',
    'define',
    `${source}\n;return Module;`
  );

  const shim = { exports: {} };
  const noRequire = () => {
    throw new Error('浏览器环境不支持 require()');
  };

  const Module = factory(shim, shim.exports, noRequire, undefined);
  if (!isObjectLike(Module)) {
    throw new Error(`emscripten 模块初始化失败：${url}`);
  }

  await new Promise((resolve, reject) => {
    if (Module.calledRun) return resolve();
    const timer = setTimeout(
      () => reject(new Error(`wasm 运行时初始化超时：${url}`)),
      60000
    );
    Module.onRuntimeInitialized = () => {
      clearTimeout(timer);
      resolve();
    };
    Module.onAbort = (what) => {
      clearTimeout(timer);
      reject(new Error(`wasm 运行时异常终止：${what}`));
    };
  });

  return Module;
}

async function load(kind) {
  if (!cache.has(kind)) {
    cache.set(kind, instantiate(BINDINGS[kind]));
  }
  return cache.get(kind);
}

function toBytes(result) {
  if (result instanceof Uint8Array) return result;
  if (result instanceof ArrayBuffer) return new Uint8Array(result);
  if (ArrayBuffer.isView(result)) {
    return new Uint8Array(result.buffer, result.byteOffset, result.byteLength);
  }
  throw new Error('woff2 编解码返回了无法识别的结果');
}

export async function compress(sfnt) {
  const Module = await load('compress');
  const input = sfnt instanceof Uint8Array ? sfnt : new Uint8Array(sfnt);
  // embind 接受 Uint8Array；拷贝一份避免 emscripten 内部持有我们的 buffer
  const result = Module.compress(new Uint8Array(input));
  if (result === false || result === null || result === undefined) {
    throw new Error('woff2 压缩失败');
  }
  return toBytes(result);
}

export async function decompress(woff2) {
  const Module = await load('decompress');
  const input = woff2 instanceof Uint8Array ? woff2 : new Uint8Array(woff2);
  const result = Module.decompress(new Uint8Array(input));
  if (result === false || result === null || result === undefined) {
    throw new Error('woff2 解压失败');
  }
  return toBytes(result);
}
