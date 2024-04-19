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
import randomString from 'randomized-string'
import { jsPDF } from "jspdf";
import {fs} from 'fs'
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

  const doc_file = new jsPDF();
//mongodb architeture
mongoose.connect(`${process.env.MONGODB_LINK}`);

const db = mongoose.connection;
let mainWindow;
let scanWindow;
let tray;
let notification;
let entreeAlert;
let sortieAlert;
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
//recursive fct to buy tickets for achat-ticket( takes louages Ids and number of tickets)
async function  buyTicket (ses,
  louageIdsList,
  numberOfTickets,
  louageCollection,
  ticketCollection,
  stationCollection,
  event,
  ticketName,
  ticketTarif){
  if(numberOfTickets==0 || louageIdsList==[]){
    return "cannot proceed for ticket shoping"
  }else{
    let firstId=louageIdsList[0]
    let firstLouage=await louageCollection.findOne({"_id":firstId})
    console.log("firstLouage: ",firstLouage)

    let nombrePlacesDisponibles=firstLouage.availableSeats
    console.log("nombre de places disponibles: ",nombrePlacesDisponibles)

    if(nombrePlacesDisponibles>0){
      if(nombrePlacesDisponibles-numberOfTickets>=0){
        let placeList=firstLouage.places[0]
        console.log("louageList: ",placeList)

        let listOfFreeSeats=getFreeSeatsList(placeList).slice(0,numberOfTickets)
        console.log("listOfFreeSeats: ",listOfFreeSeats)

        let newLouageList=modifyObject(listOfFreeSeats,placeList)
        console.log("newLouageList: ",newLouageList)

        let newAvailableSeats=nombrePlacesDisponibles-numberOfTickets
        let updateLouage=await louageCollection.updateOne(
          {"_id":firstId},
          {$set:{places:newLouageList,availableSeats:newAvailableSeats}}
        )
        console.log("updateLouage: ",updateLouage)

        let destinations=await stationCollection.findOne({email:ses.getUserAgent()}).lean()
        console.log("destinations: ",destinations)
          
        let louages = await louageCollection.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
        console.log(`les louages: ${louages}`)
        //ticket.name : destination

        let addTicket=await ticketCollection.insertMany([
          {dateOfReservation:new Date(),
          idS:destinations._id.toString(),
          idL:firstId,
          departure:destinations.city,
          destination:ticketName,
          matriculeLouage:firstLouage.matricule,
          numberOfTickets:numberOfTickets,
          price:numberOfTickets*ticketTarif}])
        console.log(addTicket)
        
        event.sender.send('destinations',destinations.louages,louages)
        console.log("data is sent to react")
        return "great"
      }else{
        let placeList=firstLouage.places[0]
        console.log("louageList: ",placeList)

        let listOfFreeSeats=getFreeSeatsList(placeList)
        console.log("listOfFreeSeats: ",listOfFreeSeats)

        let newLouageList=modifyObject(listOfFreeSeats,placeList)
        console.log("newLouageList: ",newLouageList[0])

        let newAvailableSeats=0
        let updateLouage=await louageCollection.updateOne(
          {"_id":firstId},
          {$set:{places:newLouageList,availableSeats:newAvailableSeats}}
        )
        console.log("updateLouage: ",updateLouage)

        let destinations=await stationCollection.findOne({email:ses.getUserAgent()}).lean()
        console.log("destinations: ",destinations)
          
        let louages = await louageCollection.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
        console.log(`les louages: ${louages}`)
        //ticket.name : destination

        let addTicket=await ticketCollection.insertMany([
          {dateOfReservation:new Date(),
          idS:destinations._id.toString(),
          idL:firstId,
          departure:destinations.city,
          destination:ticketName,
          matriculeLouage:firstLouage.matricule,
          numberOfTickets:Math.abs(nombrePlacesDisponibles-numberOfTickets),
          price:Math.abs(nombrePlacesDisponibles-numberOfTickets)*ticketTarif}])
        console.log(addTicket)

        event.sender.send('destinations',destinations.louages,louages)
        console.log("data is sent to react")
        return buyTicket(
          ses,
          louageIdsList.slice(1),
          Math.abs(nombrePlacesDisponibles-numberOfTickets),
          louageCollection,
          ticketCollection,
          stationCollection,
          event,
          ticketName,
          ticketTarif)
      }
    }else{
      return buyTicket(
        ses,
      louageIdsList.slice(1),
      numberOfTickets,
      louageCollection,
      ticketCollection,
      stationCollection,
      event,
      ticketName,
      ticketTarif)
    }
  }
}
//returns the free seats
function getFreeSeatsList(listSeats){
  let listFreeSeats=[];
  for(let key in listSeats){
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
// gerate code for station every day
const generateCodeStation=()=>{

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
    body:`تم تنزيل التذكرة عل الجهاز`,
  icon:join(__dirname,"../../src/renderer/src/assets/bus.png")})
}
const entreeNotification=(plaque)=>{
  entreeAlert=new Notification({
    title:'l9itlouage',
    body:`دخول اللواج ذات اللوحة ${plaque}`,
  icon:join(__dirname,"../../src/renderer/src/assets/bus.png")})
}
const sortieNotification=(plaque)=>{
  sortieAlert=new Notification({
    title:'l9itlouage',
    body:`دخول اللواج ذات اللوحة ${plaque}`,
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

app.whenReady().then(() => {

  electronApp.setAppUserModelId('com.electron')

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
      
      cron.schedule('1 0 * * * *', async() => {
        console.log('passed midnight');
        if(ses.getUserAgent()){
          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            {
                $group: {
                    _id: "$_id",
                    tax: { $push: "$tax" }
                }
            },
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log(listtax[0]==undefined)
        
        if(listtax[0]==undefined ){
          const addtax=await Station.findOneAndUpdate(
                  { email: ses.getUserAgent()},
                  { $addToSet: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
                  { new: true } 
                )
                console.log("undif*ined test",addtax)
        }else{
          console.log('else triggured')
          let fetchedDate=new Date(listtax[0].tax[0].dayOfPaiment.getFullYear(),
          listtax[0].tax[0].dayOfPaiment.getMonth(),
          listtax[0].tax[0].dayOfPaiment.getDate())
          
          let today=new Date(new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate())
  
          if(today.getTime()>fetchedDate.getTime() )
          {
            const addtax=await Station.findOneAndUpdate(
              { email: ses.getUserAgent()},
              { $push: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
              { new: true } 
            )
            console.log("new day, new money, monet money money !",addtax)
          }
        }
        }
        not()
        notification.show()
      });

      // const os = require('os');
      // const path = require('path');
      // const desktopDir = path.join(os.homedir(), "Desktop");
      // console.log(desktopDir);
      // const doc_file= new jsPDF();

      // doc_file.text("title", 40, 45);
      // doc_file.text("stationId", 40, 98);
      // doc_file.text("louageId", 40, 52);
      // doc_file.text("currentDate", 40, 96);
      // doc_file.text("price", 40, 45);
      //a_doc_file
     
      // Pipe the PDF to the response stream
      
      
      // doc_file.save(`${desktopDir}/test.pdf`);
      

      //add
      const ses = session.fromPartition('persist:name')

      ipcMain.on('add-louage',async(event,data) => {
        try{
          console.log(`new louage: ${data}`)
        let {email,
          password,
          firstNameLouage,
          lastNameLouage,
          tel,
          trajet1,
          trajet2,
          matrLeft,
          matrRight,
          codeStation}=data


          let defaultPlaces = {
            one: 'free',
            two: 'free',
            three: 'free',
            four: 'free',
            five: 'free',
            six: 'free',
            seven: 'free',
            eight: 'free',
        };
        let matricule=matrLeft+"-Tunis-"+matrRight
          
        console.log(email,
            password,
            firstNameLouage,
            lastNameLouage,
            tel,
            trajet1,
            trajet2,
            matrLeft,
            matrRight,
            codeStation)

          let checkCode=await Station.findOne({email:ses.getUserAgent()})
          if(checkCode.codeStation==codeStation){
            let newLouage=await Louaje.updateOne({email:email.toLowerCase()},
            {$set:{places:[defaultPlaces],
              password:password,
              matricule:matricule,
              availableSeats:8,
              name:firstNameLouage,
              lastName:lastNameLouage,
              email:email.toLowerCase(),
              numeroTel:tel,
              cityDeparture:trajet1,
              cityArrival:trajet2}},
            {upsert:true})
            console.log(newLouage)

              let louageId=await Louaje.findOne({email:email.toLowerCase()})
              console.log(louageId)


            const addLouage=await Station.findOneAndUpdate(
              { email: ses.getUserAgent()},
              { $addToSet: { louagesOfAllTime: louageId._id.toString() }},
              { new: true } 
            )
            console.log("addlouage: ",addLouage)

            const addLouageToDestination=await Station.findOneAndUpdate(
              { email: ses.getUserAgent(), "louages.destinationCity": addLouage.city },
              { $addToSet: { "louages.$.lougeIds": louageId._id.toString() } },
              { new: true } 
          )
          console.log(addLouageToDestination)

        const updateStation = await Station.findOneAndUpdate(
          { email: ses.getUserAgent() },
          { $inc: { countLouaje: 1 }}
        );
        console.log(updateStation.city)

        const update = await Station.findOneAndUpdate(
          { email: ses.getUserAgent(), "louages.destinationCity": updateStation.city },
          { $inc: { "louages.$.placesDisponibles": 8 } }, 
          { new: true });
        console.log("update",update)
          }

            
        }catch(error){
          console.error("error in add-louage route: ",error)
        }
        
      })
      
      
      

      ipcMain.on('achat-ticket',async(event,ticket)=>{
        try{
          console.log("ticket est achete",ticket)

          let allLouages = await Station.aggregate([
            { $match: { email: "ala@gmail.com" } },
            { $unwind: "$louages" },
            { $match: { "louages.destinationCity": "kelibia" } },
            { $project: { _id: 0, allLouageIds: "$louages.lougeIds" } }
          ]);
          console.log(allLouages[0].allLouageIds) 

          buyTicket(
            ses,
            allLouages[0].allLouageIds,
            ticket.nombrePlaces,
            Louaje,
            Ticket,
            Station,
            event,
            ticket.name,
            ticket.tarif
          )
          
          not()
          notification.show()
        }catch(error){
          console.error(`error in achat-ticket route ${error}`)
        }
      })
      //destination list
      ipcMain.on('destinations', async(event) => {
        try{
          console.log("call for data is triggured in destinations")
        
          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
          console.log(`les louages: ${louages}`)

          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log(listtax[0].tax[0]._id.toString())
        
          event.sender.send('destinations',destinations.louages,louages,listtax[0]?listtax[0].tax[0].paidLouages:[])
          console.log("data is sent to react")
        }catch(error){
          console.error(`error in destination route ${error}`)
        }
      });
      //add destination
      ipcMain.on('add-destination',async(event,data)=>{
        try{
          console.log(`new destination recieved: ${data}`)

        const addDestination=await Station.findOneAndUpdate(
          { email: ses.getUserAgent()},
          { $push: { louages: { destinationCity: data.city, tarif:data.tarif } } },
          { new: true } 
        )
        console.log(`new destination is added: ${addDestination}`)

        event.sender.send('add-destination',addDestination?true:false)
        }catch(error){
          console.error(`error in add-destination route ${error}`)
        }
      })

      //list of tickets
      ipcMain.on('tickets',async(event)=>{
        try{
          let stationId=await Station.findOne({email:ses.getUserAgent()})
          console.log(stationId.id)

          let tickets=await Ticket.find({idS:stationId.id}).lean().sort({dateOfReservation:-1})
          console.log(`les tickets: ${tickets}`)
        event.sender.send('tickets',tickets)
        }catch(error){
          console.error(`error in tickets route ${error}`)
        }

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
        
        
        const result=await Station.findOne({email:data.email,password:data.password}
          /*,{dateExpiration:{ $gt:new Date() }} */);
        if(result){
          console.log("valide data")
          ses.setUserAgent(data.email)
          event.sender.send('find',true)
          
          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log(listtax[0]==undefined)
        
        if(listtax[0]==undefined ){
          const addtax=await Station.findOneAndUpdate(
                  { email: ses.getUserAgent()},
                  { $addToSet: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
                  { new: true } 
                )
                console.log("undif*ined test",addtax)
        }else{
          console.log('else triggured')
          let fetchedDate=new Date(listtax[0].tax[0].dayOfPaiment.getFullYear(),
          listtax[0].tax[0].dayOfPaiment.getMonth(),
          listtax[0].tax[0].dayOfPaiment.getDate())
          
          let today=new Date(new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate())
  
          if(today.getTime()>fetchedDate.getTime() )
          {
            const addtax=await Station.findOneAndUpdate(
              { email: ses.getUserAgent()},
              { $push: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
              { new: true } 
            )
            console.log("new day, new money, monet money money !",addtax)
          
          }
        }
        }
        
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
      ipcMain.on("paiment",async(event,louageId)=>{
        try{
          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
          console.log(`les louages: ${louages}`)

          let taxId=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log("taxId; " ,taxId)

          let louagePaiment=await Station.findOneAndUpdate(
            { email: ses.getUserAgent(), "tax._id": taxId[0].tax[0]._id.toString() },
            { $addToSet: { "tax.$.paidLouages": louageId } },
            { new: true } 
        )
        console.log(louagePaiment)
          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log(listtax)
        
          event.sender.send('destinations',destinations.louages,louages,listtax[0]?listtax[0].tax[0].paidLouages:[])
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
          console.log(`fetched louage from db: ${louage}`)

          entreeNotification(louage.matricule)
          entreeAlert.show()

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
              { $addToSet: { "louages.$.lougeIds": louage.toString() } },
              { new: true } 
          )
          console.log(result2)

        }catch(error){console.error("error in scan-entree route:",error)}
      })

      //scan sortie
      ipcMain.on('scan-sortie',async(event,id)=>{
        const louage=await Louaje.findById({_id:id})
        console.log(`fetched louage from db: ${louage}`)

        sortieNotification(louage.matricule)
        sortieAlert.show()

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
