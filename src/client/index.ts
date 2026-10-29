import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { SessionImportProviderSlotDefinition } from '../contracts.ts'
import { SessionImportHub } from './SessionImportHub.tsx'
import { en, zh, type SessionImportLocaleKey } from './locales.ts'

type SidebarFooterContractAnchor = SidebarFooterActionOwnerProps

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'relay.session-import.provider': SessionImportProviderSlotDefinition
  }
  interface LocaleNamespaceMap {
    'relay.session-import': SessionImportLocaleKey
  }
}

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.register('relay.session-import', { zh, en }),
    'relay-session-import: dictionaries',
  )
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'relay-session-import-hub',
    order: -10,
    children: {
      'relay.session-import.provider': { kind: 'list', scope: 'root' },
    },
    locale: 'relay.session-import',
  }, SessionImportHub))
}

export type {
  SessionImportProviderDescriptor,
  SessionImportProviderOwnerProps,
  SessionImportProviderSlotDefinition,
} from '../contracts.ts'
