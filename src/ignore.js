import fs from 'node:fs/promises';
import path from 'node:path';
import ignore from 'ignore';

export const DEFAULT_EXCLUDES = [
  '.git/',
  '.svn/',
  '.hg/',
  'node_modules/',
  'vendor/',
  '.venv/',
  'venv/',
  '__pycache__/',
  'dist/',
  'build/',
  'coverage/'
];

/**
 * Build an ignore matcher using built-in defaults, .treesnapignore, and CLI patterns.
 */
export async function createIgnoreMatcher(root, {
  defaultExcludes = true,
  exclude = []
} = {}) {
  const matcher = ignore();

  if (defaultExcludes) {
    matcher.add(DEFAULT_EXCLUDES);
  }

  const ignoreFile = path.join(root, '.treesnapignore');
  try {
    const contents = await fs.readFile(ignoreFile, 'utf8');
    matcher.add(contents);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const customPatterns = exclude
    .flatMap((value) => String(value).split(','))
    .map((pattern) => pattern.trim())
    .filter(Boolean);

  matcher.add(customPatterns);
  return matcher;
}
