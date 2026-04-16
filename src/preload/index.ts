import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types'

/**
 * The only place ipcRenderer is used.
 * Everything here is available in the renderer as window.api.
 * Add methods as IPC channels are implemented in main.
 */
contextBridge.exposeInMainWorld('api', {
  openNewWindow: () => ipcRenderer.invoke(IPC.APP_OPEN_NEW_WINDOW),
})
