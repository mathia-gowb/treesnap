import fs from 'node:fs/promises';
import path from 'node:path';

export async function exportTree(content, outputPath) {
  const absoluteOutput = path.resolve(outputPath);
  await fs.mkdir(path.dirname(absoluteOutput), { recursive: true });
  await fs.writeFile(absoluteOutput, content, 'utf8');
  return absoluteOutput;
}
