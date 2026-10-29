import { describe, expect, it, vi } from 'vitest'
import { SlotCore } from '@deepseek-ai/dsh-client-ui-slots'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  IconDownloadOutlineRegular: () => null,
  Menu: () => null,
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}))

import { apply, inject } from '../src/client/index.ts'
import { SessionImportHub } from '../src/client/SessionImportHub.tsx'

function bench() {
  const slots = new SlotCore()
  slots.register({
    name: 'root',
    children: { 'sidebar.footer.action': { kind: 'list', scope: 'root' } },
  } as never, () => null)
  const dictionaries = new Map<string, unknown>()
  const disposers: Array<() => void> = []
  const ctx = {
    locale: {
      register(namespace: string, dictionary: unknown) {
        dictionaries.set(namespace, dictionary)
        return () => { dictionaries.delete(namespace) }
      },
    },
    slots: {
      inject(name: string, register: () => () => void) {
        if (slots.spec(name as never) === undefined) throw new Error(`missing slot ${name}`)
        const dispose = register()
        disposers.push(dispose)
        return dispose
      },
      register: slots.register.bind(slots),
    },
    effect(register: () => void | (() => void)) {
      const dispose = register()
      if (typeof dispose === 'function') disposers.push(dispose)
      return vi.fn()
    },
  }
  return {
    ctx,
    slots,
    dictionaries,
    dispose: () => { for (const disposer of disposers.reverse()) disposer() },
  }
}

describe('session import client apply', () => {
  it('declares only the services it consumes', () => {
    expect(inject).toEqual(['slots', 'locale'])
  })

  it('registers one footer hub and its provider child slot', () => {
    const b = bench()
    apply(b.ctx as never)
    const entries = b.slots.entries('sidebar.footer.action')
    expect(entries).toHaveLength(1)
    expect(entries[0]!.options.id).toBe('relay-session-import-hub')
    expect(entries[0]!.component).toBe(SessionImportHub)
    expect(entries[0]!.locale).toBe('relay.session-import')
    expect(b.slots.spec('relay.session-import.provider')).toMatchObject({ kind: 'list', scope: 'root' })
    expect(b.dictionaries.has('relay.session-import')).toBe(true)
  })

  it('removes the hub and provider declaration on teardown', () => {
    const b = bench()
    apply(b.ctx as never)
    b.dispose()
    expect(b.slots.entries('sidebar.footer.action')).toHaveLength(0)
    expect(b.slots.spec('relay.session-import.provider')).toBeUndefined()
    expect(b.dictionaries.has('relay.session-import')).toBe(false)
  })
})
