// Zet prototype/Main.dc.html om naar een losse index.html die zonder Claude in elke browser draait.
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../prototype/Main.dc.html', import.meta.url), 'utf8');
const helmet = src.match(/<helmet>([\s\S]*?)<\/helmet>/)[1];
const xdc = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
const logic = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const tpl = xdc.replace(/\/_blob\/[0-9a-f]+/g, 'prototype/assets/bijelkaar-logo.png');

const runtime = `
class DCLogic { constructor() { this.props = {}; this.state = {}; } setState(s) { this.state = Object.assign({}, this.state, s); render(); } }
${logic}
const comp = new Component();
const tplRoot = document.getElementById('tpl').content;
const app = document.getElementById('app');
const HOLE = /\\{\\{\\s*([^}]+?)\\s*\\}\\}/g;
function look(path, scope) { const parts = path.split('.'); let v = scope[parts[0]]; for (let i = 1; i < parts.length && v != null; i++) v = v[parts[i]]; return v; }
function interp(s, scope) { return s.replace(HOLE, (_, p) => { const v = look(p.trim(), scope); return v == null ? '' : String(v); }); }
function whole(s, scope) { const m = s.match(/^\\s*\\{\\{\\s*([^}]+?)\\s*\\}\\}\\s*$/); return m ? { v: look(m[1].trim(), scope) } : null; }
function build(node, scope, out) {
  if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.textContent, scope))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.tagName.toLowerCase();
  if (tag === 'sc-for') {
    const list = whole(node.getAttribute('list'), scope).v || []; const as = node.getAttribute('as');
    list.forEach((item, i) => { const sc = Object.assign({}, scope, { [as]: item, $index: i }); node.childNodes.forEach((c) => build(c, sc, out)); });
    return;
  }
  if (tag === 'sc-if') { if (whole(node.getAttribute('value'), scope).v) node.childNodes.forEach((c) => build(c, scope, out)); return; }
  const el = document.createElementNS(node.namespaceURI, node.localName);
  for (const a of node.attributes) {
    if (a.name.startsWith('hint-')) continue;
    if (/^on[a-z]+$/i.test(a.name)) { const w = whole(a.value, scope); if (w && typeof w.v === 'function') el.addEventListener(a.name.slice(2).toLowerCase(), w.v); continue; }
    const val = interp(a.value, scope);
    if (a.name === 'value' && 'value' in el) el.value = val; else el.setAttribute(a.name, val);
  }
  node.childNodes.forEach((c) => build(c, scope, el));
  out.appendChild(el);
}
function render() { const vals = comp.renderVals(); const frag = document.createDocumentFragment(); tplRoot.childNodes.forEach((c) => build(c, vals, frag)); app.replaceChildren(frag); }
render();
`;

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gezinshuisportaal Bij Elkaar - schermontwerp</title>
<meta name="robots" content="noindex">
<link rel="icon" href="prototype/assets/bijelkaar-logo.png">
${helmet}
</head>
<body>
<div id="app"></div>
<template id="tpl">${tpl}</template>
<script>${runtime}</script>
</body>
</html>
`;
writeFileSync(new URL('../index.html', import.meta.url), html);
console.log('index.html geschreven', html.length, 'tekens');
