import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { buildOpenApiDocument } from '../src/openapi.js';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as { version: string };

const doc = buildOpenApiDocument({ version: pkg.version });
const yaml = stringify(doc, { lineWidth: 0 });
const outputPath = resolve(root, 'openapi.yaml');

const checkMode = process.argv.includes('--check');

if (checkMode) {
  let existing = '';
  try {
    existing = readFileSync(outputPath, 'utf8');
  } catch {
    console.error(`openapi.yaml does not exist. Run \`pnpm openapi:build\` and commit it.`);
    process.exit(1);
  }
  if (existing !== yaml) {
    console.error(
      'openapi.yaml is out of date. Run `pnpm openapi:build` and commit the changes.',
    );
    process.exit(1);
  }
  console.log('openapi.yaml is up-to-date.');
} else {
  writeFileSync(outputPath, yaml);
  console.log(`Wrote ${outputPath}`);
}
