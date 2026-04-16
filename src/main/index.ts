import { app, BrowserWindow, shell } from 'electron'
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
      preload: join(__dirname, '../preload/index.js'),
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

  win.once('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}

app.whenReady().then(() => {
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
