import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('package exposes the host, client, and provider contract surfaces', () => {
  assert.equal(manifest.name, 'relay-dsh-plugin-session-import')
  assert.equal(manifest.exports['.'], './lib/host-plugin.js')
  assert.equal(manifest.exports['./client'], './lib/client.js')
  assert.equal(manifest.exports['./contracts'].types, './lib/contracts.d.ts')
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-sidebar'))
  assert.ok(manifest.files.includes('docs/images'))
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
})

test('provider contract stays independent from a concrete DSH type graph', async () => {
  const contract = await readFile(new URL('../lib/contracts.d.ts', import.meta.url), 'utf8')
  assert.match(contract, /interface SessionImportProviderSlotDefinition/)
  assert.doesNotMatch(contract, /PropsRuntime/)
  assert.doesNotMatch(contract, /declare module ['"]@deepseek-ai\/dsh-client-ui-slots/)
})

test('wide and rail trigger geometry stays compatible with the official sidebar foot', async () => {
  const css = await readFile(new URL('../src/client/SessionImportHub.module.css', import.meta.url), 'utf8')
  const trigger = css.match(/\.trigger\s*\{(?<rules>[^}]*)\}/s)?.groups?.rules ?? ''
  assert.match(trigger, /height:\s*42px;/)
  assert.match(trigger, /width:\s*calc\(100% \+ 4px\);/)
  assert.match(trigger, /letter-spacing:\s*0;/)

  const rail = css.match(/\.triggerRail\s*\{(?<rules>[^}]*)\}/s)?.groups?.rules ?? ''
  assert.match(rail, /width:\s*36px;/)
  assert.match(rail, /height:\s*36px;/)
  assert.match(rail, /border-radius:\s*50%;/)
})
