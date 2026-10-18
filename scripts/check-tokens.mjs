#!/usr/bin/env node
// Design-system guard. Fails on raw colors, off-system Tailwind colors, hardcoded motion values,
// and animation libs imported outside the motion layer. Add `// token-ok` on a line to exempt it (explain why).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const EXT = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js', '.css', '.mdx']);
const COLOR_ALLOWED = ['styles/tokens.css'];
const MOTION_LIB_ALLOWED = ['motion/', 'components/motion/', 'components/islands/'];
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTIL = 'bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|divide|accent|caret';

const rules = [
  { name: 'raw hex color', re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/, colorOnly: true, skipLine: /href=|\bid=|url\(#|xlink:href/ },
  { name: 'raw color function (rgb/hsl/oklch…)', re: /\b(?:rgba?|hsla?|oklch|oklab|hwb|lab|lch)\(/, colorOnly: true },
  { name: 'arbitrary Tailwind color', re: new RegExp(`\\b(?:${UTIL})-\\[(?:#|rgb|hsl|oklch|color:)`) },
  { name: 'default Tailwind palette color', re: new RegExp(`\\b(?:${UTIL})-(?:${PALETTE})-\\d{2,3}\\b`) },
  { name: 'hardcoded motion value (use motion tokens)', re: /\b(?:duration|ease|delay)-\[/ },
  { name: 'hardcoded font-family (use font-serif / font-sans)', re: /font-family\s*:/, colorOnly: true },
];

const libRe =
  /from\s+['"](?:gsap|gsap\/[^'"]+|lenis|three|three\/[^'"]+|@react-three\/(?:fiber|drei)(?:\/[^'"]+)?)['"]/;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : EXT.has(extname(p)) && out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(SRC)) {
  const rel = relative(SRC, file).replaceAll('\\', '/');
  const isTokens = COLOR_ALLOWED.some((a) => rel.endsWith(a));
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('token-ok')) return;
    for (const r of rules) {
      if (r.colorOnly && isTokens) continue;
      if (r.skipLine && r.skipLine.test(line)) continue;
      if (r.re.test(line)) problems.push(`${rel}:${i + 1}  ${r.name}\n    ${line.trim()}`);
    }
    if (libRe.test(line) && !MOTION_LIB_ALLOWED.some((a) => rel.startsWith(a))) {
      problems.push(`${rel}:${i + 1}  gsap, lenis and three may only be imported in src/motion, src/components/motion or src/components/islands\n    ${line.trim()}`);
    }
  });
}

if (problems.length) {
  console.error(`\n✖ Design-token guard: ${problems.length} violation(s)\n`);
  console.error(problems.join('\n\n'));
  console.error('\nFix: use tokens from src/styles/tokens.css (e.g. bg-fox-coral, text-ink, bg-brand-gradient, glass) and motion tokens from src/motion/tokens.ts. See docs/02-design-system.md.\n');
  process.exit(2);
}
console.log('✔ Design-token guard passed');
