import fs from 'node:fs/promises';
import path from 'node:path';
import { createIgnoreMatcher } from './ignore.js';

function compareEntries(a, b) {
  const aIsDirectory = a.isDirectory();
  const bIsDirectory = b.isDirectory();

  if (aIsDirectory !== bIsDirectory) return aIsDirectory ? -1 : 1;
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

/**
 * Scan a directory and return a nested tree object.
 * maxDepth counts levels below the selected root. A value of 1 shows
 * immediate children without scanning inside child directories.
 */

export async function scanDirectory(rootPath, options = {}) {
  const {
    maxDepth = Infinity,
    includeHidden = false,
    defaultExcludes = true,
    exclude = [],
    outputPath
  } = options;

  const root = path.resolve(rootPath);
  const rootStat = await fs.stat(root);
  if (!rootStat.isDirectory()) {
    throw new Error(`The selected path is not a directory: ${root}`);
  }

  const matcher = await createIgnoreMatcher(root, { defaultExcludes, exclude });
  const resolvedOutput = outputPath ? path.resolve(outputPath) : null;

  async function walk(currentPath, relativePath, depth) {

    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    entries.sort(compareEntries);

    const children = [];
    for (const entry of entries) {
      if (!includeHidden && entry.name.startsWith('.')) continue;

      const absolutePath = path.join(currentPath, entry.name);
      const relativeEntryPath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;
      const isDirectory = entry.isDirectory();
      const isSymlink = entry.isSymbolicLink();
      const matcherPath = isDirectory ? `${relativeEntryPath}/` : relativeEntryPath;

      if (matcher.ignores(matcherPath)) continue;
      if (resolvedOutput && path.resolve(absolutePath) === resolvedOutput) continue;

      const node = {
        name: entry.name,
        path: relativeEntryPath,
        type: isDirectory ? 'directory' : (isSymlink ? 'symlink' : 'file'),
        children: []
      };

      if (isDirectory && depth < maxDepth) {
        node.children = await walk(absolutePath, relativeEntryPath, depth + 1);
      }

      children.push(node);
    }

    return children;
  }

  return {
    name: path.basename(root) || root,
    path: '',
    type: 'directory',
    children: await walk(root, '', 1)
  };
}
