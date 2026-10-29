import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

for (const name of ['session-import-wide-menu.jpg', 'session-import-rail-menu.jpg']) {
  test(`${name} is tracked real-browser JPEG evidence`, async () => {
    const image = await readFile(new URL(`../docs/images/${name}`, import.meta.url))
    assert.deepEqual([...image.subarray(0, 3)], [0xff, 0xd8, 0xff])
    assert.ok(image.length > 10_000)
  })
}
