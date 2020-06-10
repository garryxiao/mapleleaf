// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = process.env.ELECTRON_ENV?.trim() == 'development'

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(app.getAppPath(), './build/preload.js')
        }
    })

    // Show the window after its ready
    mainWindow.once('ready-to-show', () => {
        // Show the window
        mainWindow.show()

        // Maximize the window
        mainWindow.maximize()

        // Not allowed to resize
        // mainWindow.resizable = false
    })

    // Hide the application menu
    mainWindow.setMenuBarVisibility(false)

    // and load the app.
    if (isDev)
        mainWindow.loadURL('http://localhost:3000/')
    else
        mainWindow.loadFile(`${path.join(app.getAppPath(), './build/index.html')}`)

    // Open the DevTools.
    // Use 'Ctrl + Shift + I' instead
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('app', (event, arg) => {
    event.reply('app-reply', { name: app.name, version: app.getVersion(), path: app.getAppPath() })
})