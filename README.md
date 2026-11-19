# treegen

A small cross-platform command-line tool that generates a directory tree and saves it to a file.

## Requirements

- Node.js 18 or newer
- npm

## Install globally

```bash
npm install -g treegen-cli
```

Then run `treegen` from any project directory.

## Install locally

```bash
npm install --save-dev treegen-cli
```

Run it with:

```bash
npx treegen
```

## Usage

```text
treegen [directory] [options]
```

| Command | Description |
| --- | --- |
| `treegen` | Scan the current directory and save `directory-tree.txt` |
| `treegen ./my-project` | Scan a specific directory |
| `treegen -o structure.txt` | Choose an output filename |
| `treegen -d 3` | Show up to three directory levels below the root |
| `treegen -e node_modules .git` | Add custom exclusions |
| `treegen -f markdown` | Save Markdown to `directory-tree.md` |
| `treegen -f json` | Save JSON to `directory-tree.json` |
| `treegen --include-hidden` | Include dot-prefixed files and directories |
| `treegen --no-default-excludes` | Disable built-in exclusions |
| `treegen --ascii` | Use ASCII branch characters |
| `treegen --help` | Show help |
| `treegen --version` | Show the package version |

Output paths are resolved relative to the directory where the command is run. By default, the output file is saved in the scanned directory and is excluded from the generated tree.

## Default exclusions

The following directories are excluded by default wherever they appear:

- `.git`
- `.svn`
- `.hg`
- `node_modules`
- `vendor`
- `.venv`
- `venv`
- `__pycache__`
- `dist`
- `build`
- `coverage`

Dot-prefixed files and directories are also hidden by default. Use `--include-hidden` to include them. Built-in exclusions still apply unless you pass `--no-default-excludes`.

## Project-specific exclusions

Create a `.treegenignore` file in the root of the directory being scanned. It uses `.gitignore`-style patterns.

Example:

```gitignore
logs/
*.tmp
private-data/
```

CLI exclusions are added on top of `.treegenignore` and the built-in exclusions.

## Development

```bash
npm install
npm test
npm run check
npm link
```

After `npm link`, the `treegen` command is available globally on your development machine. Run `npm unlink -g treegen-cli` to remove the link.

## Notes

- Symbolic links are listed but not followed, which avoids accidental recursive loops.
- The tool reads directory entries but does not read file contents.
- The scanner and formatters are separate modules so they can be reused independently.

## License

MIT
# treegen
