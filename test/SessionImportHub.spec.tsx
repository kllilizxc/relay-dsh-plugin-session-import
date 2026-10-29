// @vitest-environment jsdom

import { useEffect } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  SessionImportProviderDescriptor,
  SessionImportProviderOwnerProps,
} from '../src/contracts.ts'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  IconDownloadOutlineRegular: () => <svg data-testid="import-icon" aria-hidden="true" />,
  Menu: ({ open, anchor, items, onSelect, onClose, side }: {
    open: boolean
    anchor: React.ReactNode
    items: readonly { id: string; label: React.ReactNode; icon?: React.ReactNode }[]
    onSelect: (id: string) => void
    onClose: () => void
    side: string
  }) => <div data-menu-side={side}>
    {anchor}
    {open && <div role="menu">
      {items.map(item => <button key={item.id} role="menuitem" onClick={() => { onSelect(item.id) }}>
        {item.icon}{item.label}
      </button>)}
      <button onClick={onClose}>close-menu</button>
    </div>}
  </div>,
  Tooltip: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <>{children}<span role="tooltip">{label}</span></>
  ),
}))

import { SessionImportHub } from '../src/client/SessionImportHub.tsx'
import { en } from '../src/client/locales.ts'

afterEach(cleanup)

describe('SessionImportHub', () => {
  it('hides the trigger until at least one provider is registered', () => {
    renderHub([])
    expect(screen.queryByRole('button', { name: en.importSessions })).toBeNull()
  })

  it('renders one wide trigger and dispatches ordered provider menu rows', async () => {
    const openCodex = vi.fn()
    const openClaude = vi.fn()
    renderHub([
      provider('claude', 'Import from Claude', 20, openClaude),
      provider('codex', 'Import from Codex', 10, openCodex),
    ])

    const trigger = await screen.findByRole('button', { name: en.importSessions })
    expect(trigger.textContent).toBe(en.importSessions)
    expect(screen.getAllByTestId('import-icon')).toHaveLength(1)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const rows = screen.getAllByRole('menuitem')
    expect(rows.map(row => row.textContent)).toEqual(['Import from Codex', 'Import from Claude'])

    fireEvent.click(rows[1]!)
    expect(openClaude).toHaveBeenCalledTimes(1)
    expect(openCodex).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('uses an icon-only rail trigger and opens the menu to the right', async () => {
    renderHub([provider('codex', 'Import from Codex', 10, vi.fn())], false)
    const trigger = await screen.findByRole('button', { name: en.importSessions })
    expect(trigger.textContent).toBe('')
    expect(trigger.closest('[data-menu-side]')?.getAttribute('data-menu-side')).toBe('right')
    expect(screen.getByRole('tooltip').textContent).toBe(en.importSessions)
  })

  it('removes unloaded providers and hides the hub after the last provider leaves', async () => {
    const view = renderHub([provider('codex', 'Import from Codex', 10, vi.fn())])
    await screen.findByRole('button', { name: en.importSessions })
    view.rerender(element([], true))
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: en.importSessions })).toBeNull()
    })
  })
})

function provider(id: string, label: string, order: number, open: () => void): SessionImportProviderDescriptor {
  return { id, label, order, open, icon: <svg data-provider-icon={id} /> }
}

function ProviderMount({ descriptor, registerProvider }: {
  descriptor: SessionImportProviderDescriptor
  registerProvider: SessionImportProviderOwnerProps['registerProvider']
}) {
  useEffect(() => registerProvider(descriptor), [descriptor, registerProvider])
  return null
}

function element(providers: readonly SessionImportProviderDescriptor[], wide: boolean) {
  return <SessionImportHub
    wide={wide}
    renderSlot={((_name: string, owner: SessionImportProviderOwnerProps) => <>
      {providers.map(descriptor => (
        <ProviderMount key={descriptor.id} descriptor={descriptor} registerProvider={owner.registerProvider} />
      ))}
    </>) as never}
    t={((key: keyof typeof en) => en[key]) as never}
  />
}

function renderHub(providers: readonly SessionImportProviderDescriptor[], wide = true) {
  return render(element(providers, wide))
}
