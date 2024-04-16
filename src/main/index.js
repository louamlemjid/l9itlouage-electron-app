import { 
  app,
  shell,
  BrowserWindow,
  ipcMain ,
  dialog,
  webContents,
  session,
  protocol,
  Menu,
  Tray,
Notification} from 'electron'
import cron from 'node-cron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {mongoose} from 'mongoose';
import {nodemailer} from "nodemailer"
import dotenv from 'dotenv';
import { title } from 'process';
dotenv.config({ path: join(__dirname, '../../../my-app/.env') });
import { 
  Louaje,
  Station,
  Passenger,
  Ticket,
  Elect,
  Dest } from "./db"


//mongodb architeture
mongoose.connect(`${process.env.MONGODB_LINK}`);

const db = mongoose.connection;
let mainWindow;
let scanWindow;
let tray;
let notification;
const childWindow=()=>{
  const scanWindow = new BrowserWindow({
    width: 800,
    height: 700,
    icon:join(__dirname,"../../src/renderer/src/assets/qrlogo.png"),
    show: true,
    autoHideMenuBar: true,
    modal: true, // Make it modal if needed
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, // Allow loading external scripts
      nodeIntegration: true
    }
  })
  scanWindow.loadFile(join(__dirname, '../../src/renderer/scan.html'))
  
}
const ids=["65b8e21ea94eaa1a1b99a45","65b6b468a94eaa1a1b44c24e","65b6b44aa94eaa1a1b4493b7","65be5d7f23677124bb7d1660"]
const cities=["bou-salem","mahdia","ariana","sousse"]
//returns the free seats
function getFreeSeatsList(listSeats){
  const listFreeSeats=[];
  for(const key in listSeats){
      if(listSeats[key]=="free"){
          listFreeSeats.push(key);
      }
  }
  return listFreeSeats;
}
//returns the new seast in an array 
function modifyObject(freeSeastList,listSeats){
  const newObject={};
  for(const key in listSeats){
      if(freeSeastList.includes(key)){
          newObject[key]="occ";
      }else{
          newObject[key]=listSeats[key];
      }
  }
  return newObject;
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}
const not=()=>{
  notification=new Notification({
    title:'l9itlouage',
    body:`تم إعادة ضبط الأداءات لحالة الصفر فيرجى التثبت`,
  icon:join(__dirname,"../../src/renderer/src/assets/bus.png")})
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon:join(__dirname,"../../src/renderer/src/assets/bus.png"),
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
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Scan",
          accelerator: "Ctrl+N",
          click() {
            const scanWindow = new BrowserWindow({
              width: 800,
              height: 700,
              show: true,
              autoHideMenuBar: true,
              parent: mainWindow, // Set parent window
              modal: true, // Make it modal if needed
              webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false, // Allow loading external scripts
                nodeIntegration: true
              }
            })
            scanWindow.loadFile(join(__dirname, '../../src/renderer/scan.html'))
          }
        },
        { type: "separator" },
        { role: "quit" }
      ]
    }
  ];
  
  
  tray=new Tray(join(__dirname,"../../src/renderer/src/assets/bus.png"))
  tray.on('click',()=>{
    mainWindow.isVisible()?mainWindow.hide():mainWindow.show()
  })
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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
      cron.schedule('0 0 * * *', () => {
        console.log('cron');
        not()
        notification.show()
      });
      
     
      // const ajouter=async(city,idLouage)=>{
      //   const result2=await Station.findOneAndUpdate(
      //     { email: ses.getUserAgent(), "louages.destinationCity": city },
      //     { $addToSet: { "louages.$.lougeIds": idLouage} },
      //     { new: true } 
      //   )
      //   console.log(result2)
      // }
      // for (let i=0;i<4;i++){ajouter(cities[i],ids[i])}
      //add
      const ses = session.fromPartition('persist:name')
      
      ipcMain.on('add',async(event,data) => {
        console.log(`ping ipc 1: ${data}`)
        const result=await Elect.insertMany([
          {email:data.email,password:data.password,expireDate:data.expireDate}
      ]);
        console.log(result)
      })
      
      
      //send data
      ipcMain.on('city-data', async(event,data) => {
        console.log("call for data is triggured")
        console.log(ses.getUserAgent())
        console.log(`this is the message : ${data}`)

        const users=await Elect.find()
        console.log(users)
        event.sender.send('city-data', users);
        console.log("data is sent to react")
      });

      ipcMain.on('achat-ticket',async(event,ticket)=>{
        console.log("ticket est achete")

        const firstLouage= await Station.aggregate([
          { $match: { email: ses.getUserAgent() } },
          { $unwind: "$louages" },
          { $match: { "louages.destinationCity": ticket.name } },
          { $limit: 1 },
          { $project: { _id: 0, firstLouage: { $arrayElemAt: ["$louages.lougeIds", 0] } } }
        ]);
        console.log(firstLouage)
        
        const louage=await Louaje.findOne({id:firstLouage.firstLouage})
        console.log(louage)

        const louageList=louage.places

        const listOfFreeSeats=getFreeSeatsList(louageList).slice(0,ticket.nombrePlaces)
        console.log(listOfFreeSeats)

        const newLouageList=modifyObject(listOfFreeSeats,louageList)
        console.log(newLouageList)

        const newAvailableSeats=louage.availableSeats-ticket

        const updateLouage=await Louaje.updateOne({id:firstLouage.firstLouage},{$set:{places:newLouageList,availableSeats:newAvailableSeats}})
        
        const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
        console.log(destinations.louages)
          
        const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
        console.log(`les louages: ${louages}`)

        event.sender.send('destinations',destinations.louages,louages)
        console.log("data is sent to react")
      })
      //destination list
      ipcMain.on('destinations', async(event) => {
        try{
          console.log("call for data is triggured in destinations")
        
          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
          console.log(`les louages: ${louages}`)

          event.sender.send('destinations',destinations.louages,louages)
          console.log("data is sent to react")
        }catch(error){
          console.error(`error in destination route ${error}`)
        }
      });
      //add destination
      ipcMain.on('add-destination',async(event,data)=>{
        console.log(`new destination recieved: ${data}`)

        const addDestination=await Station.findOneAndUpdate(
          { email: ses.getUserAgent()},
          { $push: { louages: { destinationCity: data.city, tarif:data.tarif } } },
          { new: true } 
        )
        console.log(`new destination is added: ${addDestination}`)

        event.sender.send('add-destination',addDestination?true:false)
      })


      //updateDestination
      ipcMain.on('update-destination', async(event, data) => {
        try{
          console.log('Message from destination tarif liste :',data.name, data.tarif);

          if(data.name&&data.tarif){
            const update = await Station.findOneAndUpdate(
              { email: ses.getUserAgent(), "louages.destinationCity": data.name },
              { $set: { "louages.$.tarif": data.tarif } },
              { new: true });
            console.log(update)
          }

          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          event.sender.send('destinations',destinations.louages)
          console.log("data is sent to react")
        }catch(error){console.log("error in update-destination route: ",error)}
      });
      //find
      ipcMain.on('find',async(event,data) => {
        try{
        console.log(`find -- sent from sign in: ${data.email}`)
        
        const result=await Station.findOne({email:data.email,password:data.password});
        if(result){
          console.log("valide data")
          ses.setUserAgent(data.email)
          // not(data.email)
          // notification.show()
        }
        
          event.sender.send('find',data)
        }catch(error){console.error("error in signin/find route : ",error)}
      })

      //checkOut
      ipcMain.on("check-out",async(event,data)=>{
        try{
          console.log(`id sent from louage list component to checkout: ${data.id}`)

          const checkOut=await Louaje.updateOne({_id:data.id},{$set:{status:false}})
          console.log("louage est partie ?! :", checkOut)

          const pullLouage=await Station.findOneAndUpdate(
            { email: ses.getUserAgent(), "louages.destinationCity": data.cityName },
            { $pull: { "louages.$.lougeIds": data.id } },
            { new: true });
          console.log("louage puled from station:",pullLouage)

          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
          console.log(`les louages: ${louages}`)
          
          event.sender.send('destinations',destinations.louages,louages)
          console.log("data is sent to react")
        }catch(error){console.error("error in check-out route: ",error)}
      })

      //paiment
      ipcMain.on("payment",async(event,louageEmail)=>{
        try{
          console.log(`email sent from louage list component to pay: ${louageEmail}`)
          const paiment=await Elect.updateOne({email:louageEmail},{paiment:true})
          console.log(`louage a payé ?! : ${paiment}`)
          const users=await Elect.find()
          console.log(users)
          event.sender.send('city-data', users);
          console.log("data is sent to react")
        }catch(error){console.error("error in payment route: ",error)}
      })
      ipcMain.on('child-message',()=>{
        childWindow()
      })

      //update
      ipcMain.on('scan-entree',async(event,id) => {
        try{
          console.log(`id recieved in scan-entree: ${id}`)

          const louage=await Louaje.findById({_id:id})
          console.log(`fetched louage from db: ${louage._id}`)
          
          const defaultPlaces = {
              one: 'free',
              two: 'free',
              three: 'free',
              four: 'free',
              five: 'free',
              six: 'free',
              seven: 'free',
              eight: 'free',
              };

          const stationInfo=await Station.findOne({email:ses.getUserAgent()})
          console.log(stationInfo)
          
          const statusLouage=await Louaje.updateOne({id:louage.id},{$set:{places:defaultPlaces,status:true,cityDeparture:stationInfo.city,cityArrival:louage.cityDeparture}})
          console.log(`status louage est change ${statusLouage}`)
          
          const result2=await Station.findOneAndUpdate(
              { email: ses.getUserAgent(), "louages.destinationCity": louage.cityDeparture },
              { $addToSet: { "louages.$.lougeIds": louage._id.toString() } },
              { new: true } 
          )
          console.log(result2)

        }catch(error){console.error("error in scan-entree route:",error)}
      })

      //scan sortie
      ipcMain.on('scan-sortie',async(event,id)=>{
        const louage=await Louaje.findById({_id:id})
        console.log(`fetched louage from db: ${louage}`)


        const firstLouage= await Station.aggregate([
          { $match: { email: ses.getUserAgent() } },
          { $unwind: "$louages" },
          { $match: { "louages.destinationCity": louage.cityArrival } },
          { $limit: 1 },
          { $project: { _id: 0, firstLouage: { $arrayElemAt: ["$louages.lougeIds", 0] } } }
        ]);
        console.log(firstLouage)
        
        const result2=await Station.findOneAndUpdate(
          { email:ses.getUserAgent(), "louages.destinationCity": "ariana" },
          { $pull: { "louages.$.lougeIds": firstLouage[0].firstLouage } },
          { new: true } 
        )
        console.log(result2)

        const statusChange=await Louaje.updateOne({_id:id},{status:false})
        console.log(`fetched louage from db: ${statusChange}`)

        console.log("louage est sortie",id)
      })


    }catch(error){
      console.error('error accured',error)
      console.log('connection to mongodb server failed')
    }
  })
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
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
