import type { FolderNode, NoteFile, NoteIndex, VaultMeta } from '@shared/types'

export interface KnowListApi {
  createDir: (dirPath: string) => Promise<boolean>
  createNote: (folderPath: string, title: string) => Promise<string>
  deleteDir: (path: string) => Promise<boolean>
  deleteNote: (path: string) => Promise<boolean>
  getRecentVaults: () => Promise<VaultMeta[]>
  getVaultTree: (vaultPath: string) => Promise<FolderNode>
  noteExists: (path: string) => Promise<boolean>
  openExternal: (url: string) => Promise<boolean>
  openNewWindow: () => Promise<void>
  openVaultPath: (path: string) => Promise<string>
  openVaultPicker: () => Promise<string | null>
  readNote: (path: string) => Promise<NoteFile>
  renameNote: (oldPath: string, newTitle: string) => Promise<string>
  searchNotes: (vaultPath: string, query: string) => Promise<NoteIndex[]>
  writeNote: (path: string, title: string, body: string) => Promise<boolean>
}

declare global {
  interface Window {
    api: KnowListApi
  }
}