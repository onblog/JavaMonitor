/**
 * 前端抓字引擎
 *
 * 复刻 font-spider 的 spider 思路，但把「PhantomJS 渲染页面」换成
 * 「拿真实 HTML 让浏览器自己解析」：
 *   - 遍历全部文本节点（textContent 天然覆盖 font-family 继承）
 *   - 补齐 font-spider 单独处理的三类来源：placeholder / 伪元素 content / 属性文本
 * 在线工具是单字体场景，不需要原版那种按字体分离字符集的复杂度。
 */

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEMPLATE',
  'svg',
  'iframe',
  'object',
  'canvas',
  'video',
  'audio',
]);

/** CSS 里 pseudo-element 的 content: "..." / '...' */
const RE_CONTENT_STRING = /content\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/gi;

function walkTextNodes(root, sink) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    sink(current.nodeValue);
    current = walker.nextNode();
  }
}

/**
 * 从 HTML 源码里提取全部可见字形
 * @param {string} html
 * @returns {{ text: string, stats: { nodes: number, placeholders: number, pseudo: number, attrs: number } }}
 */
export function extractTextFromHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const root = doc.body || doc.documentElement;
  const parts = [];
  const stats = { nodes: 0, placeholders: 0, pseudo: 0, attrs: 0 };

  walkTextNodes(root, (value) => {
    parts.push(value);
    stats.nodes += 1;
  });

  // input / textarea 的 placeholder（font-spider 同类处理）
  for (const el of root.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    const value = el.getAttribute('placeholder');
    if (value) {
      parts.push(value);
      stats.placeholders += 1;
    }
  }

  // <style> 里的伪元素 content
  for (const styleEl of root.querySelectorAll('style')) {
    let match = RE_CONTENT_STRING.exec(styleEl.textContent || '');
    while (match) {
      const value = match[1] ?? match[2] ?? '';
      if (value) {
        parts.push(value.replace(/\\(["'\\])/g, '$1'));
        stats.pseudo += 1;
      }
      match = RE_CONTENT_STRING.exec(styleEl.textContent || '');
    }
  }

  // alt / title / value 这类不会出现在 textContent 里的文案
  for (const el of root.querySelectorAll('[alt], [title], [value]')) {
    for (const attr of ['alt', 'title', 'value']) {
      const value = el.getAttribute(attr);
      if (value && value.trim()) {
        parts.push(value);
        stats.attrs += 1;
      }
    }
  }

  return { text: parts.join(''), stats };
}

/**
 * 抓取远端页面并提取文字。
 * 浏览器同源策略会拦下大部分站点，失败时由调用方引导用户粘贴 HTML。
 * @param {string} url
 */
export async function fetchAndExtract(url) {
  const target = new URL(url, location.href);
  if (!/^https?:$/.test(target.protocol)) {
    throw new Error('只支持 http / https 网址');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let res;
  try {
    res = await fetch(target.href, { signal: controller.signal, mode: 'cors' });
  } catch {
    throw new Error(
      '浏览器同源策略拦截了该页面（目标站点未开放 CORS），请改用「粘贴 HTML」方式'
    );
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    throw new Error(`抓取失败：HTTP ${res.status}`);
  }
  const html = await res.text();
  return { ...extractTextFromHtml(html), url: target.href };
}

/**
 * 字符集归一化：去重、去控制字符与空白，保留排版标点
 * @param {string} text
 */
export function normalizeChars(text) {
  const seen = new Set();
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    // 控制字符（不含常规空格间隔符）
    if (code < 0x20 || code === 0x7f) continue;
    // 空白字符不占字形，保留与否意义不大，统一去掉
    if (/\s/.test(ch)) continue;
    if (seen.has(ch)) continue;
    seen.add(ch);
    out += ch;
  }
  return out;
}

/**
 * 统计字符集构成，用于 UI 展示
 * @param {string} chars
 */
export function describeChars(chars) {
  let cjk = 0;
  let latin = 0;
  let punct = 0;
  for (const ch of chars) {
    const code = ch.codePointAt(0);
    if (code >= 0x4e00 && code <= 0x9fff) cjk += 1;
    else if (/[A-Za-z0-9]/.test(ch)) latin += 1;
    else punct += 1;
  }
  return { total: chars.length, cjk, latin, punct };
}
