const { app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('fs')
const isMac = process.platform === 'darwin'
let window = undefined;
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  win.loadFile('index.html')
  // Open the DevTools.
  win.webContents.openDevTools()

  return win;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  window = createWindow();
});
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {
        label: 'MenuItem1',
        click: () => {
            dialog.showOpenDialog({
              properties: ['openFile']
            })
            .then(result => {
              if(result.filePaths.length > 0) {
                let filePath = result.filePaths[0];
                readFile(filePath);
              }
            })
            .catch(err => {
              console.log(err)
            });
        }
      },
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),

]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// ipcMain.on('openFile', (event, path) => {
//    const {dialog} = require('electron')
//    const fs = require('fs')
//
//     dialog.showOpenDialog({
//     properties: ['openFile']
//   }).then(result => {
//     if(result.filePaths.length > 0) {
//       let filePath = result.filePaths[0];
//       readFile(filePath);
//     }
//     else {
//       console.log("No file selected");
//     }
//   }).catch(err => {
//     console.log(err)
//   })
// })

function readFile(filepath) {
      fs.readFile(filepath, 'utf-8', (err, data) => {

         if(err){
            alert(`An error ocurred reading the file : ${err.message}`)
            return
         }
         // handle the file content
         window.webContents.send('fileData', data)
      })
   }

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
