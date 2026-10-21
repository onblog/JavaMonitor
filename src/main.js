import { subsetFont, convertFont, detectFormat, peekBase, FORMAT_LABEL } from './engine/font.js';
import { makeZip } from './engine/zip.js';
import {
  extractTextFromHtml,
  fetchAndExtract,
  normalizeChars,
  describeChars,
} from './spider.js';

const $ = (id) => document.getElementById(id);

const els = {
  dropzone: $('dropzone'),
  fileInput: $('fileInput'),
  fileCard: $('fileCard'),
  fileName: $('fileName'),
  fileMeta: $('fileMeta'),
  clearFile: $('clearFile'),
  sampleBtn: $('sampleBtn'),
  previewBox: $('previewBox'),
  previewText: $('previewText'),
  textInput: $('textInput'),
  htmlInput: $('htmlInput'),
  extractBtn: $('extractBtn'),
  urlInput: $('urlInput'),
  fetchBtn: $('fetchBtn'),
  statTotal: $('statTotal'),
  statCjk: $('statCjk'),
  statLatin: $('statLatin'),
  statPunct: $('statPunct'),
  optSfnt: $('optSfnt'),
  optSfntLabel: $('optSfntLabel'),
  optSfntHint: $('optSfntHint'),
  optWoff: $('optWoff'),
  optWoff2: $('optWoff2'),
  optNoHinting: $('optNoHinting'),
  noHintingRow: $('noHintingRow'),
  convertNote: $('convertNote'),
  resultTitle: $('resultTitle'),
  resultEmptyHint: $('resultEmptyHint'),
  runBtn: $('runBtn'),
  runHint: $('runHint'),
  resultEmpty: $('resultEmpty'),
  resultBox: $('resultBox'),
  resultSaved: $('resultSaved'),
  resultSavedLabel: $('resultSavedLabel'),
  resultMeta: $('resultMeta'),
  bars: $('bars'),
  downloads: $('downloads'),
  cssOut: $('cssOut'),
  copyCss: $('copyCss'),
  errorBox: $('errorBox'),
};

const state = {
  mode: 'compress', // 'compress' | 'convert'
  file: null,
  bytes: null,
  format: null,
  base: 'ttf', // 解压后 sfnt 的家族：ttf / otf
  family: 'MyFont',
  chars: '',
  result: null,
};

let previewFace = null;

/* ---------------- 工具 ---------------- */

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

function familyFromFilename(name) {
  const base = name.replace(/\.[^.]+$/, '');
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\u4e00-\u9fff ]+/g, '')
    .trim() || 'MyFont';
}

function showError(message) {
  els.errorBox.hidden = false;
  els.errorBox.textContent = message;
}

function clearError() {
  els.errorBox.hidden = true;
  els.errorBox.textContent = '';
}

function downloadBlob(filename, bytes, mime) {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ---------------- 文件 ---------------- */

async function setFile(file) {
  clearError();
  if (!file) return;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = detectFormat(bytes);
  if (!format) {
    showError(`「${file.name}」不是可识别的字体文件（需要 ttf / otf / woff / woff2）`);
    return;
  }

  state.file = file;
  state.bytes = bytes;
  state.format = format;
  state.base = peekBase(bytes, format);
  state.family = familyFromFilename(file.name);

  els.fileCard.hidden = false;
  els.fileName.textContent = file.name;
  els.fileMeta.textContent = `${FORMAT_LABEL[format]} · ${formatBytes(bytes.length)}`;
  els.dropzone.hidden = true;

  syncFormatLabel();
  await renderPreview();

  if (!els.textInput.value.trim()) {
    els.textInput.value = '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭。';
    updateStats();
  }
  syncRunState();
}

/** 输出选项里的「原格式」要跟着字体家族走，是 ttf 就写 ttf，是 otf 就写 otf */
function syncFormatLabel() {
  const isCff = state.base === 'otf';
  els.optSfntLabel.textContent = state.base;
  els.optSfntHint.textContent = isCff ? 'CFF 轮廓，桌面排版常用' : '回退格式，便于二次编辑';
}

function clearFile() {
  state.file = null;
  state.bytes = null;
  state.format = null;
  els.fileInput.value = '';
  els.fileCard.hidden = true;
  els.dropzone.hidden = false;
  els.previewBox.hidden = true;
  if (previewFace) {
    document.fonts.delete(previewFace);
    previewFace = null;
  }
  syncRunState();
}

async function renderPreview() {
  if (!state.bytes) return;
  try {
    if (previewFace) document.fonts.delete(previewFace);
    previewFace = new FontFace('font-squeeze-preview', state.bytes.buffer.slice(0));
    await previewFace.load();
    document.fonts.add(previewFace);
    els.previewBox.hidden = false;
    els.previewText.style.fontFamily = `'font-squeeze-preview', var(--sans)`;
    updatePreviewText();
  } catch {
    els.previewBox.hidden = true;
  }
}

/** 预览用当前字符集的前若干个字形，而不是写死的示例文案 */
function updatePreviewText() {
  const sample = [...state.chars].slice(0, 12).join('');
  els.previewText.textContent = sample || '永和九年，岁在癸丑';
}

/* ---------------- tabs ---------------- */

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('.tabpanel').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab.dataset.tab;
    });
  });
});

/* ---------------- 工作模式：按需裁剪 / 格式转换 ---------------- */

document.querySelectorAll('.mode').forEach((btn) => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

function setMode(mode) {
  if (!mode || state.mode === mode) return;
  state.mode = mode;
  const isConvert = mode === 'convert';

  document.querySelectorAll('.mode').forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', String(active));
  });

  // 转换模式不需要字符集，也没有 hinting 可裁
  $('panel-chars').hidden = isConvert;
  els.noHintingRow.hidden = isConvert;
  els.convertNote.hidden = !isConvert;

  els.runBtn.textContent = isConvert ? '开始转换' : '开始裁剪';
  els.resultSavedLabel.textContent = isConvert ? '体积变化' : '体积减少';
  els.resultTitle.textContent = isConvert ? '转换结果' : '裁剪结果';
  els.resultEmptyHint.textContent = isConvert
    ? '上传字体、选择目标格式，然后点「开始转换」'
    : '上传字体、补充文字，然后点「开始裁剪」';

  // 转换场景下 woff 更常见，默认帮用户勾上
  if (isConvert) els.optWoff.checked = true;

  els.resultBox.hidden = true;
  els.resultEmpty.hidden = false;
  clearError();
  syncRunState();
}

/* ---------------- 字符集 ---------------- */

function currentRawText() {
  return els.textInput.value;
}

function updateStats() {
  state.chars = normalizeChars(currentRawText());
  const stats = describeChars(state.chars);
  els.statTotal.textContent = stats.total;
  els.statCjk.textContent = stats.cjk;
  els.statLatin.textContent = stats.latin;
  els.statPunct.textContent = stats.punct;
  updatePreviewText();
  syncRunState();
}

/** 收集用户勾选的输出格式 —— 原格式那一格跟着字体家族走 */
function collectFormats() {
  const formats = [];
  if (els.optSfnt.checked) formats.push(state.base);
  if (els.optWoff.checked) formats.push('woff');
  if (els.optWoff2.checked) formats.push('woff2');
  return formats;
}

function syncRunState() {
  const isConvert = state.mode === 'convert';
  const hasFont = Boolean(state.bytes);
  const hasChars = isConvert || state.chars.length > 0;
  const formats = collectFormats();
  const hasFormat = formats.length > 0;
  els.runBtn.disabled = !(hasFont && hasChars && hasFormat);

  if (!hasFont) els.runHint.textContent = '请先选择字体文件';
  else if (!hasChars) els.runHint.textContent = '请先填入需要保留的文字';
  else if (!hasFormat) els.runHint.textContent = '请至少选择一种输出格式';
  else if (isConvert) els.runHint.textContent = `将输出 ${formats.join(' / ')}（容器层转换）`;
  else els.runHint.textContent = `将保留 ${state.chars.length} 个字符`;
}

els.textInput.addEventListener('input', () => {
  if (els.textInput.value.trim() === '') return updateStats();
  updateStats();
});
[els.optSfnt, els.optWoff, els.optWoff2].forEach((el) => el.addEventListener('change', syncRunState));

els.extractBtn.addEventListener('click', () => {
  clearError();
  const html = els.htmlInput.value.trim();
  if (!html) {
    showError('请先粘贴 HTML 源码');
    return;
  }
  const { text, stats } = extractTextFromHtml(html);
  const chars = normalizeChars(text);
  if (!chars) {
    showError('没能从这段 HTML 里提取到文字');
    return;
  }
  els.textInput.value = text;
  updateStats();
  document.querySelector('.tab[data-tab="text"]').click();
  showToast(`已提取 ${chars.length} 个字符（文本节点 ${stats.nodes} / placeholder ${stats.placeholders} / 伪元素 ${stats.pseudo} / 属性 ${stats.attrs}）`);
});

els.fetchBtn.addEventListener('click', async () => {
  clearError();
  const url = els.urlInput.value.trim();
  if (!url) {
    showError('请输入网址');
    return;
  }
  els.fetchBtn.textContent = '抓取中…';
  els.fetchBtn.disabled = true;
  try {
    const { text } = await fetchAndExtract(url);
    const chars = normalizeChars(text);
    if (!chars) throw new Error('页面里没有提取到文字');
    els.textInput.value = text;
    updateStats();
    document.querySelector('.tab[data-tab="text"]').click();
  } catch (err) {
    showError(err.message);
  } finally {
    els.fetchBtn.textContent = '抓取';
    els.fetchBtn.disabled = false;
  }
});

/* ---------------- 拖拽与文件输入 ---------------- */

els.fileInput.addEventListener('change', () => {
  const file = els.fileInput.files?.[0];
  if (file) setFile(file);
});

['dragenter', 'dragover'].forEach((evt) => {
  els.dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    els.dropzone.classList.add('is-dragover');
  });
});

['dragleave', 'drop'].forEach((evt) => {
  els.dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    els.dropzone.classList.remove('is-dragover');
  });
});

els.dropzone.addEventListener('drop', (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) setFile(file);
});

// 整页拖入也接受字体
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => {
  e.preventDefault();
  if (els.dropzone.hidden) return;
  const file = e.dataTransfer?.files?.[0];
  if (file) setFile(file);
});

els.clearFile.addEventListener('click', clearFile);

/* ---------------- 示例字体（FontAwesome，OFL/MIT） ---------------- */

const SAMPLE_CODEPOINTS = Array.from({ length: 48 }, (_, i) => 0xf000 + i * 3);

els.sampleBtn.addEventListener('click', async () => {
  clearError();
  els.sampleBtn.disabled = true;
  els.sampleBtn.textContent = '正在加载示例…';
  try {
    const res = await fetch('./assets/sample-fontawesome.otf');
    if (!res.ok) throw new Error(`示例字体加载失败（HTTP ${res.status}）`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    const file = new File([bytes], 'FontAwesome.otf', { type: 'font/otf' });
    await setFile(file);
    els.textInput.value = SAMPLE_CODEPOINTS.map((c) => String.fromCodePoint(c)).join('');
    updateStats();
    showToast('已载入示例字体，字符集是 48 个图标码位，预览区显示的是字形本身');
    els.runBtn.click();
  } catch (err) {
    showError(err.message);
  } finally {
    els.sampleBtn.disabled = false;
    els.sampleBtn.textContent = '手边没有字体？用内置的 FontAwesome 图标字体试一下';
  }
});

/* ---------------- 执行：裁剪或转换 ---------------- */

els.runBtn.addEventListener('click', async () => {
  if (!state.bytes) return;
  clearError();

  const isConvert = state.mode === 'convert';
  const formats = collectFormats();

  els.runBtn.classList.add('is-busy');
  els.runBtn.disabled = true;
  const originalLabel = els.runBtn.textContent;

  try {
    if (isConvert) {
      els.runBtn.textContent = '转换中…';
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      state.result = await convertFont(state.bytes, formats);
    } else {
      els.runBtn.textContent = '正在加载 WASM 引擎…';
      // 让浏览器先绘制「加载中」文案
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      els.runBtn.textContent = '裁剪中…';
      state.result = await subsetFont(state.bytes, state.chars, {
        formats,
        noHinting: els.optNoHinting.checked,
      });
    }
    renderResult(state.result);
  } catch (err) {
    showError(err?.message || String(err));
  } finally {
    els.runBtn.classList.remove('is-busy');
    els.runBtn.textContent = originalLabel;
    syncRunState();
  }
});

/* ---------------- 渲染结果 ---------------- */

const CSS_FORMAT = { ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' };
const MIME = {
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
};

function renderResult(result) {
  const isConvert = result.mode === 'convert';
  const originalSize = state.bytes.length;
  const entries = Object.entries(result.outputs);
  const best = entries.reduce((min, [, bytes]) => Math.min(min, bytes.length), Infinity);
  const saved = (1 - best / originalSize) * 100;

  els.resultEmpty.hidden = true;
  els.resultBox.hidden = false;

  els.resultSavedLabel.textContent = isConvert ? '体积变化' : '体积减少';
  els.resultSaved.textContent = isConvert
    ? `${saved >= 0 ? '−' : '+'}${Math.abs(saved).toFixed(1)}%`
    : `${Math.max(0, saved).toFixed(1)}%`;

  els.resultMeta.textContent = isConvert
    ? `${FORMAT_LABEL[result.inputFormat]} → ${entries.map(([key]) => key).join(' / ')} · 耗时 ${Math.round(result.elapsed)}ms`
    : `${result.chars} 字符 · 耗时 ${Math.round(result.elapsed)}ms`;

  const rows = [
    { key: 'origin', label: '原始', bytes: originalSize, cls: 'bar__fill--origin' },
    ...entries.map(([key, bytes]) => ({
      key,
      label: key,
      bytes: bytes.length,
      cls: key === 'woff2' ? 'bar__fill--woff2' : 'bar__fill--ttf',
    })),
  ];

  const max = Math.max(...rows.map((r) => r.bytes));
  els.bars.innerHTML = rows
    .map(
      (row) => `
      <div class="bar__row">
        <span class="bar__label">${row.label}</span>
        <span class="bar__track"><span class="bar__fill ${row.cls}" data-w="${((row.bytes / max) * 100).toFixed(1)}"></span></span>
        <span class="bar__value">${formatBytes(row.bytes)}</span>
      </div>`
    )
    .join('');

  requestAnimationFrame(() => {
    els.bars.querySelectorAll('.bar__fill').forEach((el) => {
      el.style.width = `${el.dataset.w}%`;
    });
  });

  const slug = familyFromFilename(state.file?.name || 'font').replace(/\s+/g, '-');
  const suffix = isConvert ? 'converted' : 'subset';

  /** @type {Array<{label:string, cls?:string, run:()=>void}>} */
  const downloads = entries.map(([key, bytes]) => ({
    label: `下载 ${key}`,
    cls: key === 'woff2' ? 'primary-dl' : '',
    run: () => downloadBlob(`${slug}-${suffix}.${key}`, bytes, MIME[key] || 'application/octet-stream'),
  }));

  if (entries.length > 1) {
    downloads.push({
      label: '下载全部（zip）',
      run: () => {
        const files = entries.map(([key, bytes]) => ({ name: `${slug}-${suffix}.${key}`, data: bytes }));
        downloadBlob(`${slug}-${suffix}.zip`, makeZip(files), 'application/zip');
      },
    });
  }

  els.downloads.innerHTML = '';
  for (const item of downloads) {
    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = item.cls || '';
    btn.textContent = item.label;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      item.run();
    });
    els.downloads.appendChild(btn);
  }

  els.cssOut.textContent = buildCssSnippet(slug, suffix, entries.map(([key]) => key));
}

function buildCssSnippet(slug, suffix, formats) {
  const src = formats
    .map((key) => `    url('./${slug}-${suffix}.${key}') format('${CSS_FORMAT[key] || key}')`)
    .join(',\n');

  return `@font-face {\n  font-family: '${state.family}';\n  src:\n${src};\n  font-display: swap;\n}`;
}

els.copyCss.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.cssOut.textContent);
    els.copyCss.textContent = '已复制';
    setTimeout(() => (els.copyCss.textContent = '复制'), 1600);
  } catch {
    showError('复制失败，请手动选中代码');
  }
});

/* ---------------- toast ---------------- */

let toastTimer = null;
function showToast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:26px', 'transform:translateX(-50%)',
      'background:#1c2433', 'border:1px solid #33405a', 'color:#e9eef6',
      'padding:10px 16px', 'border-radius:10px', 'font-size:12.5px',
      'box-shadow:0 12px 34px rgba(0,0,0,.5)', 'z-index:99',
      'max-width:min(620px,90vw)', 'line-height:1.5', 'text-align:center',
    ].join(';');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.transition = 'opacity .3s';
    el.style.opacity = '0';
  }, 3200);
}

/* ---------------- 初始化 ---------------- */

updateStats();
syncRunState();
