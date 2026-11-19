import test from 'node:test';
import assert from 'node:assert/strict';
import { formatText, formatMarkdown, formatJson } from '../src/formatter.js';

const sampleTree = {
  name: 'demo',
  type: 'directory',
  path: '',
  children: [
    { name: 'src', type: 'directory', path: 'src', children: [
      { name: 'index.js', type: 'file', path: 'src/index.js', children: [] }
    ] },
    { name: 'README.md', type: 'file', path: 'README.md', children: [] }
  ]
};

test('formats a Unicode text tree', () => {
  assert.equal(formatText(sampleTree), 'demo/\n├── src/\n│   └── index.js\n└── README.md\n');
});

test('formats an ASCII text tree', () => {
  assert.equal(formatText(sampleTree, { ascii: true }), 'demo/\n|-- src/\n|   `-- index.js\n`-- README.md\n');
});

test('formats Markdown and JSON', () => {
  assert.match(formatMarkdown(sampleTree), /^# demo/);
  assert.deepEqual(JSON.parse(formatJson(sampleTree)), sampleTree);
});
