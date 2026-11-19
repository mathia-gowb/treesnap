#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { Command } from 'commander';
import { scanDirectory } from './scanner.js';
import { formatTree } from './formatter.js';
import { exportTree } from './exporter.js';

const program = new Command();

program
  .name('treegen')
  .description('Generate a directory tree and save it to a file.')
  .argument('[directory]', 'directory to scan', '.')
  .option('-o, --output <file>', 'output filename or path')
  .option('-d, --depth <number>', 'maximum directory depth below the root')
  .option('-e, --exclude <patterns...>', 'additional ignore patterns, for example -e node_modules .git')
  .option('-f, --format <format>', 'output format: text, markdown, or json', 'text')
  .option('--include-hidden', 'include dot-prefixed files and directories')
  .option('--no-default-excludes', 'do not apply the built-in exclusion list')
  .option('--ascii', 'use ASCII tree characters instead of Unicode characters')
  .showHelpAfterError();

program.addHelpText('after', `
Examples:
  treegen
  treegen C:\\Projects\\MyApp
  treegen -o structure.txt
  treegen --depth 3
  treegen --exclude node_modules .git
  treegen --format markdown -o STRUCTURE.md
`);

program.parse(process.argv);

const options = program.opts();
const [directoryArgument] = program.args;

async function main() {
  const root = path.resolve(directoryArgument || '.');
  const maxDepth = options.depth === undefined ? Infinity : Number(options.depth);

  if (options.depth !== undefined && (!Number.isInteger(maxDepth) || maxDepth < 1)) {
    throw new Error('--depth must be a positive whole number.');
  }

  const validFormats = ['text', 'markdown', 'json'];
  if (!validFormats.includes(options.format)) {
    throw new Error(`--format must be one of: ${validFormats.join(', ')}.`);
  }

  const defaultFilename = options.format === 'markdown'
    ? 'directory-tree.md'
    : options.format === 'json'
      ? 'directory-tree.json'
      : 'directory-tree.txt';

  const outputPath = options.output
    ? path.resolve(process.cwd(), options.output)
    : path.join(root, defaultFilename);

  const tree = await scanDirectory(root, {
    maxDepth,
    includeHidden: Boolean(options.includeHidden),
    defaultExcludes: options.defaultExcludes,
    exclude: options.exclude || [],
    outputPath
  });

/*   const content = formatTree(tree, options.format, { ascii: Boolean(options.ascii) });
  const savedPath = await exportTree(content, outputPath);
  process.stdout.write(`Directory tree saved to: ${savedPath}\n`); */
}

main().catch((error) => {
  process.stderr.write(`treegen: ${error.message}\n`);
  process.exitCode = 1;
});
