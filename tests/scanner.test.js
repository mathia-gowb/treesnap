import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { scanDirectory } from '../src/scanner.js';

async function makeFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'treegen-test-'));
  await fs.mkdir(path.join(root, 'src', 'nested'), { recursive: true });
  await fs.mkdir(path.join(root, 'node_modules'), { recursive: true });
  await fs.writeFile(path.join(root, 'README.md'), 'hello');
  await fs.writeFile(path.join(root, 'src', 'index.js'), 'console.log(1)');
  await fs.writeFile(path.join(root, 'src', 'nested', 'deep.js'), 'deep');
  await fs.writeFile(path.join(root, 'node_modules', 'package.js'), 'ignored');
  await fs.writeFile(path.join(root, '.hidden'), 'hidden');
  return root;
}

test('scans files and folders while applying default exclusions', async (t) => {
  const root = await makeFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const tree = await scanDirectory(root);
  const names = tree.children.map((item) => item.name);
  assert.deepEqual(names, ['src', 'README.md']);
  assert.deepEqual(tree.children[0].children.map((item) => item.name), ['nested', 'index.js']);
});

test('respects maximum depth and hidden-file option', async (t) => {
  const root = await makeFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const tree = await scanDirectory(root, { maxDepth: 1, includeHidden: true });
  assert.equal(tree.children.some((item) => item.name === '.hidden'), true);
  const src = tree.children.find((item) => item.name === 'src');
  assert.deepEqual(src.children, []);
});

test('loads .treegenignore and custom exclusions', async (t) => {
  const root = await makeFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, '.treegenignore'), 'README.md\n');
  const tree = await scanDirectory(root, { exclude: ['src/'] });
  assert.deepEqual(tree.children, []);
});
