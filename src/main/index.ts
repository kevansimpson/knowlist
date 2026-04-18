import { IPC } from '@shared/types'
import { searchIndex } from './services/indexService'
import { 
  createDir,
  createNote,
  deleteDir,
  deleteNote,
  getVaultTree,
  noteExists,
  readNote,
  renameNote,
  writeNote } from './services/noteService'
import { addRecentVault, getRecentVaults } from './services/vaultService'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { join } from 'path'

// Allow multiple instances — one window per vault (Decision D-010)
// Do NOT call app.requestSingleInstanceLock()

// Register deep link protocol for future OAuth (Decision D-013)
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('knowlist', process.execPath, [
      join(__dirname, process.argv[1])
    ])
  }
} else {
  app.setAsDefaultProtocolClient('knowlist')
}

export function createWindow(vaultPath?: string): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 700,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 14, y: 12 },
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    const url = vaultPath
      ? `${process.env['ELECTRON_RENDERER_URL']}?vault=${encodeURIComponent(vaultPath)}`
      : process.env['ELECTRON_RENDERER_URL']
    win.loadURL(url)
  } else {
    win.loadFile(
      join(__dirname, '../renderer/index.html'),
      vaultPath ? { query: { vault: vaultPath } } : undefined
    )
  }

  if (process.env['NODE_ENV'] === 'development') {
    win.webContents.openDevTools()
  }
  win.once('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}

app.whenReady().then(() => {
  ipcMain.handle(IPC.DIR_CREATE, async (_e, dirPath: string) => {
    await createDir(dirPath)
    return true
  })

  ipcMain.handle(IPC.DIR_DELETE, async (_e, dirPath: string) => {
    await deleteDir(dirPath)
    return true
  })

  ipcMain.handle(IPC.INDEX_SEARCH, async (_e, vaultPath: string, query: string) => {
    return searchIndex(vaultPath, query)
  })

  ipcMain.handle(IPC.NOTE_CREATE, async (_e, folderPath: string, title: string) => {
    return createNote(folderPath, title)
  })

  ipcMain.handle(IPC.NOTE_DELETE, async (_e, notePath: string) => {
    await deleteNote(notePath)
    return true
  })

  ipcMain.handle(IPC.NOTE_EXISTS, async (_e, notePath: string) => {
    return noteExists(notePath)
  })

  ipcMain.handle(IPC.NOTE_READ, async (_e, notePath: string) => {
    return readNote(notePath)
  })

  ipcMain.handle(IPC.NOTE_RENAME, async (_e, oldPath: string, newTitle: string) => {
    return renameNote(oldPath, newTitle)
  })

  ipcMain.handle(IPC.NOTE_WRITE, async (_e, notePath: string, title: string, body: string) => {
    await writeNote(notePath, title, body)
    return true
  })

  ipcMain.handle(IPC.SHELL_OPEN_EXTERNAL, async (_e, url: string) => {
    await shell.openExternal(url)
    return true
  })

  ipcMain.handle(IPC.VAULT_GET_RECENT, async () => {
    return getRecentVaults()
  })

  ipcMain.handle(IPC.VAULT_GET_TREE, async (_e, vaultPath: string) => {
    return getVaultTree(vaultPath)
  })

  ipcMain.handle(IPC.VAULT_OPEN_PATH, async (_e, vaultPath: string) => {
    await addRecentVault(vaultPath)
    return vaultPath
  })

  ipcMain.handle(IPC.VAULT_OPEN_PICKER, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Open Vault',
      buttonLabel: 'Open',
    })
    if (result.canceled || result.filePaths.length === 0) return null
    const vaultPath = result.filePaths[0]
    await addRecentVault(vaultPath)
    return vaultPath
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Placeholder: deep link handler wired up in Phase 5
app.on('open-url', (_event, url) => {
  console.log('Deep link received (not yet handled):', url)
})
