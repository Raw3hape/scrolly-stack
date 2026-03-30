/**
 * Postinstall patch for troika-worker-utils.
 *
 * The `workerBootstrap` function is serialized via `.toString()` and executed
 * inside a Web Worker blob. SWC (used by Next.js / Turbopack) transforms
 * `instanceof Error` into a helper call that references a chunk-scoped
 * variable — which doesn't exist in the worker's isolated scope, causing
 * `ReferenceError: p is not defined`.
 *
 * This script replaces `instanceof Error` inside `workerBootstrap` with a
 * duck-type check that survives serialization.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const esmPath = resolve(
  __dirname,
  '../node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js',
);

const MARKER = '/* troika-worker-patch */';
const HELPER = `var _isErr = function(e) { return e && typeof e === 'object' && 'message' in e; }; ${MARKER}`;

let source;
try {
  source = readFileSync(esmPath, 'utf8');
} catch {
  console.warn('[patch-troika-worker] troika-worker-utils not found — skipping.');
  process.exit(0);
}

// Already patched (idempotent)
if (source.includes(MARKER)) {
  console.log('[patch-troika-worker] already patched — skipping.');
  process.exit(0);
}

// 1. Inject _isErr helper inside workerBootstrap, right after the first statement
const anchor = "var modules = Object.create(null);";
if (!source.includes(anchor)) {
  console.error('[patch-troika-worker] could not find anchor in workerBootstrap — aborting.');
  process.exit(1);
}

let patched = source.replace(anchor, `${anchor}\n  ${HELPER}`);

// 2. Replace all `<expr> instanceof Error` with `_isErr(<expr>)`
//    Matches: word-char identifiers like `depResult`, `result`, `rej`, `err`
patched = patched.replace(/(\w+)\s+instanceof\s+Error/g, '_isErr($1)');

writeFileSync(esmPath, patched, 'utf8');
console.log('[patch-troika-worker] patched troika-worker-utils successfully.');
