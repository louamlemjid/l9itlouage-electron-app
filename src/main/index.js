import { app, shell, BrowserWindow, ipcMain ,dialog, session} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {mongoose} from 'mongoose';

//mongodb architeture
mongoose.connect('mongodb+srv://louam-lemjid:8hAgfKf2ZDauLxoj@cluster0.mjqmopn.mongodb.net/electdb');
const electschema=new mongoose.Schema({
  email:String,
  password:String,
  expireDate:Date,
  paiment:Boolean,
  inStation:Boolean
})
const Elect=mongoose.model("Elect",electschema);

const destschema=new mongoose.Schema({
  name:String,
  tarif:Number,
})
const Dest=mongoose.model("Dest",destschema);

const db = mongoose.connection;

function scan () {
  const win = new BrowserWindow({
    webPreferences: {
      preload: ('../preload/scanPreload.js')
    }
  })
  
  win.loadURL('File://C:/Users/Dell/Desktop/recover/my-app/src/renderer/scan.html')
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', async function () {
    console.log('Connected to the database');
    //do something
    try{
      console.log('working ..')
      
      //add
      const ses = session.fromPartition('persist:name')
      
      ipcMain.on('add',async(event,data) => {
        console.log(`ping ipc 1: ${data}`)
        const result=await Elect.insertMany([
          {email:data.email,password:data.password,expireDate:data.expireDate}
      ]);
        console.log(result)
      })
      // childWindow(mainWindow)
      //send data
      ipcMain.on('get-city', async(event,data) => {
        console.log("call for data is triggured")
        // childWindow()
        console.log(ses.getUserAgent())
        console.log(`this is the message : ${data}`)
        const users=await Elect.find()
        console.log(users)
        event.sender.send('city-data', users);
        console.log("data is sent to react")
      });
      //destination list
      ipcMain.on('destinations', async(event) => {
        console.log("call for data is triggured in destinations")
        // childWindow()
        
        const destinations=await Dest.find()
        console.log(destinations)
        event.sender.send('destinations', destinations);
        console.log("data is sent to react")
      });
      //child
      ipcMain.on('child-message', (event, message) => {
        console.log('Message from child window:', message);
        // Add your handling logic here
      });
      //updateDestination
      ipcMain.on('update-destination', async(event, data) => {
        console.log('Message from destination tarif liste :',data.name, data.tarif);
        if(data.name&&data.tarif){
          const update=await Dest.updateOne({name:data.name},{tarif:data.tarif})
          console.log(update)
        }
        const destinations=await Dest.find()
        console.log(destinations)
        event.sender.send('destinations', destinations);
        console.log("data is sent to react")
        // Add your handling logic here
      });
      //find
      ipcMain.on('find',async(event,data) => {
        console.log(`find -- sent from sign in: ${data.email}`)
        
        const result=await Elect.findOne({email:data.email,password:data.password});
        console.log(result)
        if(result){ses.setUserAgent(data.email)}
        event.sender.send('find',result)
      })
      //checkOut
      ipcMain.on("check-out",async(event,louageEmail)=>{
        console.log(`email sent from louage list component to checkout: ${louageEmail}`)
        const checkOut=await Elect.updateOne({email:louageEmail},{inStation:false})
        console.log(`louage est partie ?! : ${checkOut}`)
        const users=await Elect.find()
        console.log(users)
        event.sender.send('city-data', users);
        console.log("data is sent to react")
      })
      //paiment
      ipcMain.on("payment",async(event,louageEmail)=>{
        console.log(`email sent from louage list component to pay: ${louageEmail}`)
        const paiment=await Elect.updateOne({email:louageEmail},{paiment:true})
        console.log(`louage a payé ?! : ${paiment}`)
        const users=await Elect.find()
        console.log(users)
        event.sender.send('city-data', users);
        console.log("data is sent to react")
      })
      //update
      ipcMain.on('add',async(event,data) => {
        console.log(`update ipc 3: ${data}`)
      //   
      })
    }catch(error){
      console.error('error accured',error)
      console.log('connection to mongodb server failed')
    }
  })
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  // scan()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
