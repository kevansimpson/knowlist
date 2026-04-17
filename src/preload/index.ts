import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types'
import type { VaultMeta } from '@shared/types'

contextBridge.exposeInMainWorld('api', {
  getVaultTree: (vaultPath: string) => ipcRenderer.invoke(IPC.VAULT_GET_TREE, vaultPath),
  getRecentVaults: (): Promise<VaultMeta[]> => ipcRenderer.invoke(IPC.VAULT_GET_RECENT),
  openNewWindow: () => ipcRenderer.invoke(IPC.APP_OPEN_NEW_WINDOW),
  openVaultPath: (path: string) => ipcRenderer.invoke(IPC.VAULT_OPEN_PATH, path),
  openVaultPicker: () => ipcRenderer.invoke(IPC.VAULT_OPEN_PICKER),
  readNote: (path: string) => ipcRenderer.invoke(IPC.NOTE_READ, path),
  writeNote: (path: string, title: string, body: string) => ipcRenderer.invoke(IPC.NOTE_WRITE, path, title, body),
})
