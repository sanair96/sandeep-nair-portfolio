import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const HANDWRITTEN_LIMIT = 300
const SUPPORT_LIMIT = 500
const MAX_EXCEPTION_LIMIT = 500

const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  '.next',
  'coverage',
  'node_modules',
  'playwright-report',
  'test-results',
])

const EXCLUDED_FILES = new Set(['next-env.d.ts'])
const CHECKED_EXTENSIONS = new Set(['.css', '.ts', '.tsx'])

const EXCEPTIONS = new Map([
  // [
  //   "src/path/to/file.ts",
  //   { limit: 400, reason: "Exact, temporary reason for keeping this file together." },
  // ],
])

function toRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/')
}

function isSupportFile(relativePath) {
  const fileName = path.posix.basename(relativePath)

  return (
    relativePath.startsWith('scripts/') ||
    relativePath.startsWith('tests/') ||
    /(^|[.-])(config|setup)\.[cm]?[jt]sx?$/.test(fileName)
  )
}

function countNonBlankLines(source) {
  return source.split(/\r?\n/u).filter((line) => line.trim().length > 0).length
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) {
      continue
    }

    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)))
    } else if (entry.isFile()) {
      files.push(entryPath)
    }
  }

  return files
}

function validateExceptions(existingFiles) {
  const errors = []

  for (const [relativePath, exception] of EXCEPTIONS) {
    if (!existingFiles.has(relativePath)) {
      errors.push(`${relativePath}: exception points to a missing file`)
    }

    if (!exception.reason?.trim()) {
      errors.push(`${relativePath}: exception requires a written reason`)
    }

    if (
      !Number.isInteger(exception.limit) ||
      exception.limit <= HANDWRITTEN_LIMIT ||
      exception.limit > MAX_EXCEPTION_LIMIT
    ) {
      errors.push(
        `${relativePath}: exception limit must be an integer from ${
          HANDWRITTEN_LIMIT + 1
        } to ${MAX_EXCEPTION_LIMIT}`,
      )
    }
  }

  return errors
}

async function main() {
  const files = await collectFiles(ROOT)
  const relativeFiles = new Set(files.map(toRelative))
  const errors = validateExceptions(relativeFiles)

  for (const filePath of files) {
    const relativePath = toRelative(filePath)

    if (EXCLUDED_FILES.has(relativePath) || !CHECKED_EXTENSIONS.has(path.extname(filePath))) {
      continue
    }

    const fileStats = await stat(filePath)

    if (!fileStats.isFile()) {
      continue
    }

    const source = await readFile(filePath, 'utf8')
    const lineCount = countNonBlankLines(source)
    const exception = EXCEPTIONS.get(relativePath)
    const limit =
      exception?.limit ?? (isSupportFile(relativePath) ? SUPPORT_LIMIT : HANDWRITTEN_LIMIT)

    if (lineCount > limit) {
      const exceptionHint = exception ? ` (${exception.reason})` : ''
      errors.push(`${relativePath}: ${lineCount} non-blank lines exceeds ${limit}${exceptionHint}`)
    }
  }

  if (errors.length > 0) {
    console.error('File-size policy violations:\n')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('File-size policy passed.')
}

await main()
