/**
 * 构建到 dist/：只拷贝运行时真正需要的文件（纯静态，无需打包）。
 */
import { cp, mkdir, rm, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

const ENTRIES = ['index.html', 'src', 'wasm', 'assets'];

// 只给 README 用的资源，不进产物（screenshot 是官网截图，big-test 是本地压测样本）
const EXCLUDE = new Set(['big-test.ttf', 'screenshot.png']);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const entry of ENTRIES) {
  const from = join(ROOT, entry);
  const info = await stat(from).catch(() => null);
  if (!info) {
    console.warn(`skip missing entry: ${entry}`);
    continue;
  }

  if (info.isDirectory()) {
    const target = join(DIST, entry);
    await cp(from, target, {
      recursive: true,
      filter: (src) => !EXCLUDE.has(src.split('/').pop()),
    });
  } else {
    await cp(from, join(DIST, entry));
  }
}

const total = async (dir) => {
  let bytes = 0;
  for (const name of await readdir(dir)) {
    const info = await stat(join(dir, name));
    bytes += info.isDirectory() ? await total(join(dir, name)) : info.size;
  }
  return bytes;
};

console.log(`built dist/ (${(await total(DIST) / 1048576).toFixed(2)} MB)`);
