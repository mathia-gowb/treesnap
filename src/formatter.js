function renderTextNode(node, prefix, isLast, lines, ascii) {
  const branch = ascii ? (isLast ? '`-- ' : '|-- ') : (isLast ? '└── ' : '├── ');
  const suffix = node.type === 'directory' ? '/' : (node.type === 'symlink' ? ' [symlink]' : '');
  lines.push(`${prefix}${branch}${node.name}${suffix}`);

  const childPrefix = prefix + (ascii ? (isLast ? '    ' : '|   ') : (isLast ? '    ' : '│   '));
  node.children.forEach((child, index) => {
    renderTextNode(child, childPrefix, index === node.children.length - 1, lines, ascii);
  });
}

export function formatText(tree, { ascii = false } = {}) {
  const rootLabel = `${tree.name}/`;
  const lines = [rootLabel];
  tree.children.forEach((child, index) => {
    renderTextNode(child, '', index === tree.children.length - 1, lines, ascii);
  });
  return `${lines.join('\n')}\n`;
}

export function formatMarkdown(tree, options = {}) {
  const treeText = formatText(tree, options).trimEnd();
  return `# ${tree.name}\n\n\`\`\`text\n${treeText}\n\`\`\`\n`;
}

export function formatJson(tree) {
  return `${JSON.stringify(tree, null, 2)}\n`;
}

export function formatTree(tree, format = 'text', options = {}) {
  switch (format) {
    case 'text': return formatText(tree, options);
    case 'markdown': return formatMarkdown(tree, options);
    case 'json': return formatJson(tree);
    default: throw new Error(`Unsupported output format: ${format}`);
  }
}
