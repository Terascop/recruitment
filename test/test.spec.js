import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

describe('My simple test', function () {
  it('1 + 1 equals 2', () => {
    assert.deepEqual((1 + 1),2)
  })
})