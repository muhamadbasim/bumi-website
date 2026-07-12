import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const componentPath = path.resolve(currentDir, '../src/components/BrandLogo.astro')
const headerPath = path.resolve(currentDir, '../src/components/SiteHeader.astro')
const homePagePath = path.resolve(currentDir, '../src/pages/index.astro')
const globalStylesPath = path.resolve(currentDir, '../src/styles/global.css')
const layoutPath = path.resolve(currentDir, '../src/layouts/BaseLayout.astro')
const loaderPath = path.resolve(currentDir, '../src/components/BrandLoader.astro')
const publicBrandDir = path.resolve(currentDir, '../public/brand')
const repoRoot = path.resolve(currentDir, '../..')
const gitignorePath = path.join(repoRoot, '.gitignore')

test('BrandLogo keeps the expected wrapper and default light-image alt contract', () => {
  const componentSource = readFileSync(componentPath, 'utf8')

  assert.match(componentSource, /const\s*\{\s*alt\s*=\s*'Bumi'/)
  assert.match(componentSource, /<span\s+class:list=\{\['brand-logo',\s*className\]\}>/)
  assert.match(componentSource, /src="\/brand\/bumi-logo-app-light\.svg"[\s\S]*?alt=\{alt\}/)
})

test('BrandLogo keeps the decorative dark-image accessibility contract', () => {
  const componentSource = readFileSync(componentPath, 'utf8')

  assert.match(componentSource, /src="\/brand\/bumi-logo-app-dark\.svg"[\s\S]*?alt=""[\s\S]*?aria-hidden="true"/)
})

test('site chrome and global theme reference the official Bumi identity assets and tokens', () => {
  const headerSource = readFileSync(headerPath, 'utf8')
  const homePageSource = readFileSync(homePagePath, 'utf8')
  const globalStylesSource = readFileSync(globalStylesPath, 'utf8')

  assert.match(headerSource, /import\s+BrandLogo\s+from\s+'\.\/BrandLogo\.astro'/)
  assert.match(headerSource, /<BrandLogo\s+alt=""\s*\/>/)
  assert.match(homePageSource, /<BrandLogo\s+alt="Bumi"\s*\/>/)
  assert.match(globalStylesSource, /family=Poppins:wght@400;500;600;700/)
  assert.match(globalStylesSource, /--brand-midnight:#0b1020/i)
  assert.match(globalStylesSource, /\.brand-logo\s*\{/)
})

test('layout exposes Bumi document metadata and bounded loader', () => {
  const layout = readFileSync(layoutPath, 'utf8')
  const loader = readFileSync(loaderPath, 'utf8')
  assert.match(layout, /rel="icon" href="\/brand\/bumi-logo-app-dark\.svg"/)
  assert.match(layout, /property="og:image" content="https:\/\/bumi\.basim\.id\/brand\/bumi-social-card\.svg"/)
  assert.match(layout, /<BrandLoader\s*\/>/)
  assert.match(loader, /1200/)
})

test('review artifacts stay out of Git tracking', () => {
  const gitignoreSource = readFileSync(gitignorePath, 'utf8')

  assert.match(gitignoreSource, /^\.superpowers\/$/m)

  const trackedFiles = execFileSync('git', ['ls-files', '.superpowers/sdd/task-1-report.md'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim()

  assert.equal(trackedFiles, '')
})

test('official Bumi logo assets exist in Astro public brand directory', () => {
  const requiredAssets = [
    'bumi-logo-primary.svg',
    'bumi-logo-app-light.svg',
    'bumi-logo-app-dark.svg',
    'bumi-logo-monochrome.svg',
  ]

  for (const asset of requiredAssets) {
    assert.equal(existsSync(path.join(publicBrandDir, asset)), true, `Missing asset: ${asset}`)
  }
})
