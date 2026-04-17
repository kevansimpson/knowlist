import type { FolderNode, VaultMeta } from '@shared/types'

export interface KnowListApi {
  getRecentVaults: () => Promise<VaultMeta[]>
  getVaultTree: (vaultPath: string) => Promise<FolderNode>
  openNewWindow: () => Promise<void>
  openVaultPath: (path: string) => Promise<string>
  openVaultPicker: () => Promise<string | null>
}

declare global {
  interface Window {
    api: KnowListApi
  }
}