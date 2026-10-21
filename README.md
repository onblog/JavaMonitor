<p align="center">
  <a href="./README.zh-CN.md">🇨🇳 中文</a> · <b>🇺🇸 English</b>
</p>

<p align="center">
  <img src="./assets/icon.svg" width="112" height="112" alt="FontSqueeze" />
</p>

<h1 align="center">FontSqueeze · 字压</h1>

<p align="center">
  Subset a WebFont down to the characters your page actually uses, and convert freely between <code>ttf</code> / <code>woff</code> / <code>woff2</code>.<br />
  Everything runs in WebAssembly and the browser's native compression streams — <b>your font never leaves the page</b>.
</p>

<p align="center">
  <a href="https://font.wordtk.com">Live demo</a> ·
  <a href="#two-modes">Two modes</a> ·
  <a href="#deploy-to-cloudflare">Deploy</a> ·
  <a href="#limitations">Limitations</a>
</p>

---

No backend, no queue, no waiting. Drop a font in, get the result back — fully offline.

## Two modes

| Mode | What it does | Typical use |
| --- | --- | --- |
| **Subset** | Extracts the characters your page really uses and rebuilds a font containing only those glyphs | CJK fonts are often 10MB+; a subset usually lands in the low hundreds of KB |
| **Convert** | Swaps the file container only, never touching glyph outlines | You have a `ttf` but need `woff2`; or you received a `woff` and want the `ttf` back |

Both modes share one engine and are one click apart at the top of the page.

### Where format conversion stops (important)

A font format has two orthogonal dimensions, and this project only handles the **container**:

| Dimension | Content | This project |
| --- | --- | --- |
| Container | `ttf`(sfnt) / `woff`(zlib wrapper) / `woff2`(Brotli wrapper) | ✅ Lossless three-way conversion |
| Outline | TrueType `glyf`(quadratic Bézier) / CFF `otf`(cubic Bézier) | ❌ Not attempted — no lossless path exists |

`otf → ttf` means rewriting CFF cubic curves into glyf quadratics, re-encoding hinting instructions and composite glyphs. It is lossy and notoriously error-prone; even FontForge warns about it. This tool deliberately **does not offer it**, because a font that "opens fine but renders crooked" is worse than no output at all.

That is why the "original format" output option follows your input: if your source is `otf`, it says `otf` and will not pretend to hand you a real `ttf`.

## Why not just port font-spider

The original is a `Node + PhantomJS` CLI, and neither part can run inside a Worker or a browser:

| Original dependency | Purpose | Why it cannot move | What this project does |
| --- | --- | --- | --- |
| `browser-x` (PhantomJS) | Render the page to determine used characters | No headless browser available in a Worker/browser | The user's own `DOMParser` *is* the rendering engine |
| `fontmin` / `fonteditor-core` | Subset glyphs | Pure JS works but is slow on large fonts, and `ttf2woff2` is a native addon | harfbuzz `hb-subset.wasm` — about 0.9s for a 22MB font |
| `ttf2woff2` | Produce woff2 | C++ native module, unavailable in browsers | WASM build of the official woff2 encoder |
| `fs` / `gulp` / backup dirs | Disk I/O | No filesystem in a browser | In-memory `ArrayBuffer` → direct download |

## Measured results

22.2MB CJK font, 498 Han characters retained:

| Metric | Result |
| --- | --- |
| Subset + dual-format output | ~900ms |
| Output size | ttf 316.8 KB / woff2 164.2 KB |
| Peak JS heap | ~32 MB |

Bundled FontAwesome sample (107.1 KB `otf`):

| Operation | Result |
| --- | --- |
| Subset to 48 icon codepoints | 93.7% smaller, ~43ms |
| Container conversion `otf → otf / woff / woff2` | woff 88.3 KB / woff2 78.5 KB, ~680ms |
| woff encode → decode round trip | Byte-for-byte identical (lossless) |

## Features

- **Zero backend**: host the static files and you are done — no Workers CPU time consumed
- **Private by design**: fonts stay in local memory and are gone on refresh
- **Character extraction**: text nodes, `placeholder`, pseudo-element `content`, `alt` / `title` / `value`
- **Multiple input sources**: paste text / paste HTML / try fetching a URL (subject to same-origin policy)
- **Multiple outputs**: source-outline `ttf`/`otf`, `woff`, `woff2` — individually, as a zip, plus generated `@font-face` code
- **Dependency-free woff conversion**: encoding and decoding use the native `CompressionStream` / `DecompressionStream`, so no pako is needed

## Run locally

```bash
npm run dev        # http://127.0.0.1:8787/
```

There are no runtime dependencies; `npm install` is only needed to deploy.

> The first "Start subsetting" click downloads ~1.5MB of WASM (harfbuzz 652KB + woff2 encoder 926KB + decoder 315KB), then it is cached by the browser.
> Converting to `woff` or the original format **downloads no WASM at all** — it uses only native compression streams.

## Deploy to Cloudflare

Static assets only, no Worker script:

```bash
npm install          # only to get wrangler
npm run deploy       # builds dist/ and uploads
```

`wrangler.toml` declares only `[assets]` plus a custom domain, so the site is served purely as static files and consumes no Worker CPU time.

## Project layout

```
index.html              Single page
src/main.js             UI and interaction (subset / convert modes)
src/spider.js           Character extraction (DOMParser + charset normalization)
src/engine/font.js      Format detection, read/write pipeline, subset and convert entry points
src/engine/woff.js      woff container codec (native CompressionStream, no dependencies)
src/engine/harfbuzz.js  hb-subset.wasm wrapper (rebuilds glyph tables for a charset)
src/engine/woff2.js     woff2 codec wrapper (works around the emscripten export quirk)
src/engine/zip.js       STORE-mode zip writer
wasm/                   WASM artifacts and emscripten bindings
scripts/serve.mjs       Zero-dependency local static server
scripts/build.mjs       Copies artifacts into dist/
```

### About the emscripten files in `wasm/`

The `wawoff2` build only runs `module.exports = Module` on its Node branch, so importing it directly in a browser never exposes `compress` / `decompress`. `src/engine/woff2.js` evaluates the source in an isolated `Function` scope and explicitly retrieves the inner `Module` object, which sidesteps the broken export.

## Limitations

- **No outline conversion**: `otf`(CFF) and `ttf`(glyf) never rewrite each other, only their container
- **Extraction scope**: same-origin policy prevents emulating font-spider's PhantomJS rendering; paste dynamically injected copy manually
- **Input formats**: `ttf` / `otf` / `woff` / `woff2`
- **woff decoding requires `CompressionStream`**: Chrome 80+ / Firefox 113+ / Safari 16.4+

## License

[AGPL-3.0-only](./LICENSE) with a commercial dual license.

Free for personal and open-source use. For closed-source commercial distribution or a commercial service, contact the author for a commercial license.
