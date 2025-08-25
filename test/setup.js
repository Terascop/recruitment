import { spec } from 'node:test/reporters'
import { run } from 'node:test'
import { finished } from 'node:stream'
import { globSync } from 'glob'

const files = globSync('./**/**/*.spec.js')
let testInError = false

const inspectArg = process.argv.find((arg) => arg.includes('--debug-port'))
let debugPort
if (inspectArg) {
  debugPort = parseInt(inspectArg.replace(/.*?(\d+)$/, '$1'), 10)
  if (isNaN(debugPort)) {
    debugPort = undefined
  }
}

const stream = run({
  files,
  concurrency: !debugPort,
  watch: process.argv.includes('--watch'),
  inspectPort: debugPort,
  execArgv: debugPort ? [`--inspect-brk=0.0.0.0:${debugPort}`] : [],
  coverage: process.argv.includes('--coverage'),
  coverageIncludeGlobs: ['**/*.js'],
  coverageExcludeGlobs: ['**/node_modules/**', '**/test/**', '**/**/*.cjs'],
  async setup() {
    console.info(`Test suite start`)
  },
})
  .on('test:fail', (data) => {
    testInError = true
  })
  .compose(spec)

finished(stream, () => {
  if (testInError) {
    process.exit(1)
  }
})

stream.pipe(process.stdout)