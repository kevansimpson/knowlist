import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types'
import type { VaultMeta } from '@shared/types'

contextBridge.exposeInMainWorld('api', {
  createDir: (dirPath: string) => ipcRenderer.invoke(IPC.DIR_CREATE, dirPath),
  createNote: (folderPath: string, title: string) => ipcRenderer.invoke(IPC.NOTE_CREATE, folderPath, title),
  deleteDir: (path: string) => ipcRenderer.invoke(IPC.DIR_DELETE, path),
  deleteNote: (path: string) => ipcRenderer.invoke(IPC.NOTE_DELETE, path),
  getVaultTree: (vaultPath: string) => ipcRenderer.invoke(IPC.VAULT_GET_TREE, vaultPath),
  getRecentVaults: (): Promise<VaultMeta[]> => ipcRenderer.invoke(IPC.VAULT_GET_RECENT),
  noteExists: (path: string) => ipcRenderer.invoke(IPC.NOTE_EXISTS, path),
  openExternal: (url: string) => ipcRenderer.invoke(IPC.SHELL_OPEN_EXTERNAL, url),
  openNewWindow: () => ipcRenderer.invoke(IPC.APP_OPEN_NEW_WINDOW),
  openVaultPath: (path: string) => ipcRenderer.invoke(IPC.VAULT_OPEN_PATH, path),
  openVaultPicker: () => ipcRenderer.invoke(IPC.VAULT_OPEN_PICKER),
  readNote: (path: string) => ipcRenderer.invoke(IPC.NOTE_READ, path),
  renameNote: (oldPath: string, newTitle: string) => ipcRenderer.invoke(IPC.NOTE_RENAME, oldPath, newTitle),
  searchNotes: (vaultPath: string, query: string) => ipcRenderer.invoke(IPC.INDEX_SEARCH, vaultPath, query),
  writeNote: (path: string, title: string, body: string) => ipcRenderer.invoke(IPC.NOTE_WRITE, path, title, body),
})
