import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(packageRoot, 'src')
const outDir = join(packageRoot, 'dist')

async function collectCssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name)
      if (entry.isDirectory()) return collectCssFiles(entryPath)
      return entry.name.endsWith('.css') ? [entryPath] : []
    })
  )
  return nested.flat()
}

for (const file of await collectCssFiles(srcDir)) {
  const target = join(outDir, relative(srcDir, file))
  await mkdir(dirname(target), { recursive: true })
  await copyFile(file, target)
}
