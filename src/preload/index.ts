import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types'
import type { VaultMeta } from '@shared/types'

contextBridge.exposeInMainWorld('api', {
  createDir: (dirPath: string) => ipcRenderer.invoke(IPC.DIR_CREATE, dirPath),
  createNote: (folderPath: string, title: string) => ipcRenderer.invoke(IPC.NOTE_CREATE, folderPath, title),
  getVaultTree: (vaultPath: string) => ipcRenderer.invoke(IPC.VAULT_GET_TREE, vaultPath),
  getRecentVaults: (): Promise<VaultMeta[]> => ipcRenderer.invoke(IPC.VAULT_GET_RECENT),
  openNewWindow: () => ipcRenderer.invoke(IPC.APP_OPEN_NEW_WINDOW),
  openVaultPath: (path: string) => ipcRenderer.invoke(IPC.VAULT_OPEN_PATH, path),
  openVaultPicker: () => ipcRenderer.invoke(IPC.VAULT_OPEN_PICKER),
  readNote: (path: string) => ipcRenderer.invoke(IPC.NOTE_READ, path),
  renameNote: (oldPath: string, newTitle: string) => ipcRenderer.invoke(IPC.NOTE_RENAME, oldPath, newTitle),
  writeNote: (path: string, title: string, body: string) => ipcRenderer.invoke(IPC.NOTE_WRITE, path, title, body),
})
