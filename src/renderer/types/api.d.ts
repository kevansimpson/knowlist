import type { FolderNode, NoteFile, VaultMeta } from '@shared/types'

export interface KnowListApi {
  createDir: (dirPath: string) => Promise<boolean>
  createNote: (folderPath: string, title: string) => Promise<string>
  getRecentVaults: () => Promise<VaultMeta[]>
  getVaultTree: (vaultPath: string) => Promise<FolderNode>
  openNewWindow: () => Promise<void>
  openVaultPath: (path: string) => Promise<string>
  openVaultPicker: () => Promise<string | null>
  readNote: (path: string) => Promise<NoteFile>
  renameNote: (oldPath: string, newTitle: string) => Promise<string>
  writeNote: (path: string, title: string, body: string) => Promise<boolean>
}

declare global {
  interface Window {
    api: KnowListApi
  }
}