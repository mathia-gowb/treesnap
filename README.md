# treesnap

A small cross-platform command-line tool that generates a directory tree and saves it to a file.

## Requirements

- Node.js 18 or newer
- npm

## Install globally

```bash
npm install -g treesnap
```

Then run `treesnap` from any project directory.

## Install locally

```bash
npm install --save-dev treesnap
```

Run it with:

```bash
npx treesnap
```

## Usage

```text
treesnap [directory] [options]
```

| Command | Description |
| --- | --- |
| `treesnap` | Scan the current directory and save `directory-tree.txt` |
| `treesnap ./my-project` | Scan a specific directory |
| `treesnap -o structure.txt` | Choose an output filename |
| `treesnap -d 3` | Show up to three directory levels below the root |
| `treesnap -e node_modules .git` | Add custom exclusions |
| `treesnap -f markdown` | Save Markdown to `directory-tree.md` |
| `treesnap -f json` | Save JSON to `directory-tree.json` |
| `treesnap --include-hidden` | Include dot-prefixed files and directories |
| `treesnap --no-default-excludes` | Disable built-in exclusions |
| `treesnap --ascii` | Use ASCII branch characters |
| `treesnap --help` | Show help |
| `treesnap --version` | Show the package version |

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

Dot-prefixed files and directories are also hidden by default. Use `--include-hidden` to include them. Built-in exclusions still apply unless you