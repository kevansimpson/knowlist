/**
 * IPC channel name constants — single source of truth for main, preload, and renderer.
 * New channels are added here as features are built.
 */
export const IPC = {
  APP_OPEN_NEW_WINDOW: 'app:open-new-window',
  VAULT_GET_RECENT:  'vault:get-recent',
  VAULT_GET_TREE: 'vault:get-tree',
  VAULT_OPEN_PATH:   'vault:open-path',
  VAULT_OPEN_PICKER: 'vault:open-picker',
} as const

export type IpcChannel = typeof IPC[keyof typeof IPC]

export interface FolderNode {
  name: string
  path: string
  relativePath: string
  children: FolderNode[]
  notes: NoteSummary[]
}

export interface NoteSummary {
  path: string
  title: string
  modified: string
}

export interface VaultMeta {
  path: string
  name: string
  lastOpened: string // ISO date string
}
