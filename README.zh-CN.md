<p align="center">
  <img src="./assets/icon.svg" width="104" height="104" alt="字压 FontSqueeze" />
</p>

<h1 align="center">字压 · FontSqueeze</h1>

<p align="center">
  <b>🇨🇳 中文</b> · <a href="./README.md">🇺🇸 English</a>
</p>

<p align="center">
  按页面实际用字裁剪 WebFont，并在 <code>ttf</code> / <code>woff</code> / <code>woff2</code> 之间自由转换。<br />
  全部计算跑在 WebAssembly 与浏览器原生压缩流里 —— <b>字体不会上传到任何服务器</b>。
</p>

<p align="center">
  <a href="https://font.wordtk.com">在线体验</a> ·
  <a href="#两种模式">两种模式</a> ·
  <a href="#部署到-cloudflare">部署</a> ·
  <a href="#限制">限制</a>
</p>

---

没有后端、没有队列、没有等待。打开页面、拖进字体、拿到结果，全程离线可用。

## 两种模式

| 模式 | 做什么 | 典型场景 |
| --- | --- | --- |
| **按需裁剪** | 抓取页面实际用到的字，重建只含这些字形的字体 | 中文字体动辄 10MB+，裁剪后常降到百 KB 级 |
| **格式转换** | 仅更换文件容器，不裁剪字形 | 只有一个 `ttf`，需要 `woff2` 上线；或拿到 `woff` 想还原成 `ttf` |

两种模式共用同一套引擎，界面顶部一键切换。

### 关于格式转换的边界（重要）

字体格式有两个正交的维度，本项目只处理**容器层**：

| 维度 | 内容 | 本项目 |
| --- | --- | --- |
| 容器层 | `ttf`(sfnt) / `woff`(zlib 外壳) / `woff2`(Brotli 外壳) | ✅ 三态无损互转 |
| 轮廓层 | TrueType `glyf`(二次贝塞尔) / CFF `otf`(三次贝塞尔) | ❌ 不做，也无损方案 |

`otf → ttf` 需要把 CFF 的三次贝塞尔曲线重写成 glyf 的二次贝塞尔，还要处理 hinting 指令与复合字形，是有损且极易出错的工程。业界（含 FontForge）对这条路径都会给出警告，本工具**明确不提供**，以避免产出「能打开但渲染错位」的字体。

因此界面里的「原格式」选项会跟随你的源文件变化：源文件是 `otf`，它就显示 `otf`，不会假装能给你一个真 `ttf`。

## 为什么不是直接移植 font-spider

原版是一个绑定 `Node + PhantomJS` 的 CLI，两段链路都无法在 Worker / 浏览器里运行：

| 原版依赖 | 作用 | 为什么不能搬 | 本项目的做法 |
| --- | --- | --- | --- |
| `browser-x`（PhantomJS） | 真实渲染页面以确定用字 | 浏览器/Worker 里没有可跑的无头浏览器 | 用户浏览器的 `DOMParser` 就是真实渲染引擎 |
| `fontmin` / `fonteditor-core` | 裁剪字形 | 纯 JS 可用，但大字体慢且 `ttf2woff2` 是原生扩展 | harfbuzz `hb-subset.wasm`，22MB 字体约 0.9s |
| `ttf2woff2` | 生成 woff2 | C++ 原生模块，无法在浏览器运行 | 官方 woff2 编码器的 WASM 构建 |
| `fs` / `gulp` / 备份目录 | 读写磁盘 | 浏览器无文件系统 | 内存 `ArrayBuffer` → 直接下载 |

## 实测数据

22.2MB 中文字体，保留 498 个汉字：

| 指标 | 结果 |
| --- | --- |
| 裁剪 + 双格式输出耗时 | 约 900ms |
| 输出体积 | ttf 316.8 KB / woff2 164.2 KB |
| 峰值 JS 堆 | 约 32 MB |

内置 FontAwesome 示例（107.1 KB `otf`）：

| 操作 | 结果 |
| --- | --- |
| 裁剪 48 个图标码位 | 缩减 93.7%，耗时约 43ms |
| 容器转换 `otf → otf / woff / woff2` | woff 88.3 KB / woff2 78.5 KB，耗时约 680ms |
| woff 编解码往返 | 字节级完全一致（无损） |

## 特性

- **零后端**：托管静态文件即可，不消耗 Workers 的 CPU 配额
- **隐私**：字体只停留在本地内存，刷新即销毁
- **抓字**：解析文本节点、`placeholder`、伪元素 `content`、`alt` / `title` / `value`
- **多来源输入**：直接输入文字 / 粘贴 HTML / 尝试抓取网址（受同源策略限制）
- **多格式输出**：跟随源轮廓的 `ttf`/`otf`、`woff`、`woff2`，可单独下载或打包 zip，并生成对应 `@font-face` 代码
- **零依赖格式转换**：`woff` 编解码直接用浏览器原生 `CompressionStream` / `DecompressionStream`，不引入 pako

## 本地运行

```bash
npm run dev        # http://127.0.0.1:8787/
```

没有任何运行时依赖，`npm install` 只在需要部署时才必要。

> 首次点击「开始裁剪」会下载约 1.5MB 的 WASM（harfbuzz 652KB + woff2 编码器 926KB + 解码器 315KB），之后走浏览器缓存。
> 只做 `woff` / `原格式` 转换时**不需要下载任何 WASM**，走纯原生压缩流。

## 部署到 Cloudflare

静态资源优先，不写 Worker 脚本：

```bash
npm install          # 只为拿 wrangler
npm run deploy       # 构建 dist/ 并上传
```

`wrangler.toml` 里只声明了 `[assets]` 与自定义域名，站点以纯静态方式提供，不占用 Worker 的 CPU 时间。

## 目录结构

```
index.html              单一页面
src/main.js             UI 与交互（裁剪 / 转换双模式）
src/spider.js           抓字引擎（DOMParser 提取 + 字符集归一化）
src/engine/font.js      格式探测、读写管道、裁剪与转换的统一出口
src/engine/woff.js      woff 容器编解码（原生 CompressionStream，零依赖）
src/engine/harfbuzz.js  hb-subset.wasm 封装（按字符集重建字形表）
src/engine/woff2.js     woff2 编解码封装（处理 emscripten 导出问题）
src/engine/zip.js       STORE 模式 zip 打包
wasm/                   WASM 产物与 emscripten 绑定
scripts/serve.mjs       零依赖本地静态服务
scripts/build.mjs       拷贝产物到 dist/
```

### 关于 `wasm/` 里的 emscripten 文件

`wawoff2` 的产物只在 Node 分支执行 `module.exports = Module`，在浏览器里直接 import 拿不到 `compress` / `decompress`。`src/engine/woff2.js` 用 `Function` 构造隔离作用域执行源码并显式取回内部的 `Module` 对象，绕开了这个导出缺陷。

## 限制

- **轮廓不转换**：`otf`(CFF) 与 `ttf`(glyf) 之间不会互相改写，只换容器
- **抓字局限**：受浏览器同源策略限制，无法模拟 `font-spider` 的 PhantomJS 渲染抓字；动态插入的文案请直接粘贴
- **输入格式**：`ttf` / `otf` / `woff` / `woff2`
- **woff 解码需要 `CompressionStream`**：Chrome 80+ / Firefox 113+ / Safari 16.4+

## 许可

[AGPL-3.0-only](./LICENSE) + 商业授权双轨。

个人与开源项目可自由使用；商业闭源分发或提供商业服务，请联系作者获取商业授权。
