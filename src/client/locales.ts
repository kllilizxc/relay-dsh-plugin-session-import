export const en = {
  importSessions: 'Import sessions...',
} as const

export const zh = {
  importSessions: '导入会话...',
} satisfies Record<keyof typeof en, string>

export type SessionImportLocaleKey = keyof typeof en
