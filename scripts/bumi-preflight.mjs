#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const checks = []

function check(name, pass, detail = '') {
  checks.push({ name, pass, detail })
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

const requiredFiles = [
  'package.json',
  'nuxt.config.ts',
  'app/pages/index.vue',
  'app/data/home.ts',
  'app/assets/css/main.css',
  'docs/agentic-deterministic-workflow.md',
]

for (const file of requiredFiles) {
  check(`required file: ${file}`, existsSync(join(root, file)))
}

const packageJson = JSON.parse(read('package.json'))
check('script exists: build', Boolean(packageJson.scripts?.build), 'npm run build must be available')
check('script exists: typecheck', Boolean(packageJson.scripts?.typecheck), 'npm run typecheck must be available')
check('script exists: preflight', Boolean(packageJson.scripts?.preflight), 'npm run preflight must be available')
check('script exists: verify', Boolean(packageJson.scripts?.verify), 'npm run verify must be available')

const nuxtConfig = read('nuxt.config.ts')
check('Poppins font configured', nuxtConfig.includes('Poppins'))
check('Bumi title configured', /Bumi\s+—/.test(nuxtConfig))
check('description meta configured', nuxtConfig.includes("name: 'description'"))

const homePage = read('app/pages/index.vue')
const videoMatch = homePage.match(/<source\s+src="([^"]+)"\s+type="video\/mp4"\s*\/>/)
check('hero video source exists in homepage', Boolean(videoMatch))
if (videoMatch) {
  const publicPath = videoMatch[1].replace(/^\//, 'public/')
  check(`hero video asset exists: ${videoMatch[1]}`, existsSync(join(root, publicPath)))
}
check('hero uses autoplay muted loop playsinline', /<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/.test(homePage.replace(/\n/g, ' ')))
check('hero content keeps CTA visible', homePage.includes('hero-ctas'))
check('no dummy hero video embedded', !homePage.includes('/videos/bumi-hero-dummy.mp4'), 'dummy video must not be the active hero source')

const css = read('app/assets/css/main.css')
check('brand dark navy token present', css.includes('#0b1020') || css.includes('#0B1020'))
check('brand electric blue token present', css.includes('#2d78ff') || css.includes('#2D78FF') || css.includes('#0066ff') || css.includes('#0066FF'))
check('Poppins used in CSS', css.includes('Poppins'))

const failed = checks.filter((item) => !item.pass)
for (const item of checks) {
  const status = item.pass ? 'PASS' : 'FAIL'
  console.log(`${status} ${item.name}${item.detail ? ` — ${item.detail}` : ''}`)
}

if (failed.length) {
  console.error(`\nBumi preflight failed: ${failed.length} check(s) failed.`)
  process.exit(1)
}

console.log(`\nBumi preflight passed: ${checks.length} checks.`)
