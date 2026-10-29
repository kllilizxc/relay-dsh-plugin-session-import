import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  IconDownloadOutlineRegular,
  Menu,
  Tooltip,
  type MenuItem,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  PropsLocale,
  PropsRenderSlots,
} from '@deepseek-ai/dsh-client-ui-slots'
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {
  SessionImportProviderDescriptor,
  SessionImportProviderOwnerProps,
} from '../contracts.ts'
import type { SessionImportLocaleKey } from './locales.ts'
import css from './SessionImportHub.module.css'

interface RegisteredProvider extends SessionImportProviderDescriptor {
  token: symbol
}

type Props = SidebarFooterActionOwnerProps
  & PropsRenderSlots<'relay.session-import.provider'>
  & PropsLocale<'relay.session-import'>

/** One provider-neutral footer action backed by provider-owned import flows. */
export function SessionImportHub({ wide, renderSlot, t }: Props): ReactNode {
  const records = useRef(new Map<symbol, RegisteredProvider>())
  const [providers, setProviders] = useState<readonly RegisteredProvider[]>([])
  const [open, setOpen] = useState(false)

  const publish = useCallback(() => {
    setProviders([...records.current.values()].sort((left, right) =>
      (left.order ?? 0) - (right.order ?? 0) || left.id.localeCompare(right.id)))
  }, [])

  const registerProvider = useCallback<SessionImportProviderOwnerProps['registerProvider']>((provider) => {
    if ([...records.current.values()].some(record => record.id === provider.id)) {
      throw new Error(`session import provider "${provider.id}" is already registered`)
    }
    const token = Symbol(provider.id)
    records.current.set(token, { ...provider, token })
    publish()
    return () => {
      if (!records.current.delete(token)) return
      publish()
    }
  }, [publish])

  useEffect(() => {
    if (providers.length === 0) setOpen(false)
  }, [providers.length])

  const items: readonly MenuItem[] = providers.map(provider => ({
    id: provider.id,
    label: provider.label,
    icon: provider.icon,
  }))

  return (
    <>
      {renderSlot('relay.session-import.provider', { registerProvider })}
      {providers.length > 0 && (
        <Menu
          className={wide ? css.menuRoot : `${css.menuRoot} ${css.menuRootRail}`}
          open={open}
          onClose={() => { setOpen(false) }}
          items={items}
          onSelect={(id) => {
            const provider = providers.find(candidate => candidate.id === id)
            if (provider === undefined) return
            setOpen(false)
            provider.open()
          }}
          side={wide ? 'top' : 'right'}
          portal
          anchor={(
            <Tooltip label={t('importSessions')} side="top" delayMs={500} disabled={wide}>
              <button
                type="button"
                className={wide ? css.trigger : `${css.trigger} ${css.triggerRail}`}
                aria-label={t('importSessions')}
                aria-haspopup="menu"
                aria-expanded={open}
                data-session-import-hub="true"
                onClick={() => { setOpen(value => !value) }}
              >
                <IconDownloadOutlineRegular size={wide ? 16 : 18} />
                {wide && <span className={css.label}>{t('importSessions')}</span>}
              </button>
            </Tooltip>
          )}
        />
      )}
    </>
  )
}

export type { SessionImportLocaleKey }
