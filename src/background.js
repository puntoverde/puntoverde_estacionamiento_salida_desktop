'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'


import mysql from 'promise-mysql'
import db from './db.js'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let winList

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
  },icon: path.join(__static, 'icon.png') })

  
  winList = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
  },icon: path.join(__static, 'icon.png') })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    winList.loadURL(process.env.WEBPACK_DEV_SERVER_URL+"#salidas")
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    winList.loadURL('app://./index.html#salidas')
  }

  win.on('closed', () => {
    win = null
  })

  winList.on('closed', () => {
    winList = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



ipcMain.on('getSocios',async (e,n_accion,clasificacion)=>{
  
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});
  const con= await db;
  
  let socios=await con.query(`SELECT acciones.cve_accion,socios.cve_socio,socios.posicion AS nip,persona.nombre,persona.apellido_paterno,persona.apellido_materno,(SELECT COUNT(tag) FROM autos_usuario WHERE autos_usuario.cve_accion=acciones.cve_accion AND repuve_tag=1) AS tags,SUM(IF(repuve_tag=1,1,0)) AS tag_actual,acciones.estatus FROM socios
  INNER JOIN persona ON persona.cve_persona=socios.cve_persona
  INNER JOIN acciones ON acciones.cve_accion=socios.cve_accion
  LEFT JOIN autos_usuario ON socios.cve_socio=autos_usuario.cve_socio
  WHERE acciones.numero_accion=? AND acciones.clasificacion=? GROUP BY socios.cve_socio`,[n_accion,clasificacion]);

  // con.end();

  e.returnValue=socios;

}) 

ipcMain.on('getAutosSocio',async (e,socio)=>{

  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});
  const con= await db;
  
  let autos=await con.query(`SELECT id_auto_usuario, cve_accion, cve_socio, tipo, marca, modelo, color, placas, tag, repuve_tag, fecha_registro, convert(estatus,SIGNED) as estatus,folio_pago_tag,capacidad FROM autos_usuario where cve_socio=?`,[socio]);

  // con.end(); 

  e.returnValue=autos;

})

ipcMain.on('saveAuto',async (e,data =[])=>{
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});

  const con= await db;
  
  let {insertId}=await con.query(`INSERT INTO autos_usuario(cve_accion,cve_socio,tipo,marca,modelo,color,placas,tag,repuve_tag,fecha_registro,estatus,folio_pago_tag,capacidad) VALUES(?,?,?,?,?,?,?,?,?,CURDATE(),1,?,?)`,data);

  // con.end();

  e.returnValue=insertId;
})

ipcMain.on('updateAutos',async(e,data=[])=>{
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});

  const con= await db;
  
  let actualizar=await con.query(`UPDATE autos_usuario SET tipo=?,marca=?,modelo=?,color=?,placas=?,tag=?,repuve_tag=? WHERE id_auto_usuario=?`,data);

  // con.end();

  e.returnValue=actualizar;
})

ipcMain.on('deleteAutos',async(e,idauto)=>{
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});
  
  const con= await db;

  let eliminar=await con.query(`DELETE FROM autos_usuario WHERE id_auto_usuario=?`,idauto);

  // con.end();

  e.returnValue=eliminar;
})

ipcMain.on('registarSalidaAutos',async (e,tag)=>{
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});
  
  const con= await db;

  let actualizar=await con.query(`UPDATE acceso_auto SET salida=curtime() WHERE salida IS NULL AND acceso_auto.id_auto_usuario =(SELECT id_auto_usuario FROM autos_usuario WHERE autos_usuario.tag=? LIMIT 1) ;`,tag);
  
  // con.end();

  e.returnValue=actualizar; 
})

ipcMain.on('altaBajaAuto',async (e,estatus,id)=>{
  console.log('estatus=>',estatus,'id_auto=>',id)
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});

  const con= await db;
  
  let actualizar=await con.query(`UPDATE autos_usuario SET estatus=? WHERE autos_usuario.id_auto_usuario = ?;`,[estatus,id]);

  // con.end();

  e.returnValue=actualizar;  
})


ipcMain.on('getListaSalidas',async e=>{

  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});

  const con= await db;
  
  let salidas=await con.query(`select 
  concat(acciones.numero_accion,case acciones.clasificacion when 1 then 'A' when 2 then 'B' when 3 then 'C' else '' end) as accion,acceso_auto.salida,autos_usuario.color,convert(autos_usuario.tipo,unsigned) tipo,autos_usuario.marca,autos_usuario.modelo,autos_usuario.placas,concat_ws(' ',persona.nombre,persona.apellido_paterno,persona.apellido_materno) as usuario
  from acceso_auto
  inner join autos_usuario on acceso_auto.id_auto_usuario=autos_usuario.id_auto_usuario
  inner join socios on autos_usuario.cve_socio=socios.cve_socio
  inner join persona on socios.cve_persona=persona.cve_persona
  inner join acciones on socios.cve_accion=acciones.cve_accion
  where acceso_auto.fecha = curdate() order by acceso_auto.salida desc`);

  // con.end();

  e.returnValue=salidas;
 
})

ipcMain.on('getWinSalidas',()=>{
  winList.webContents.send('renderGetSalidas');
})


ipcMain.on('saveAcceso',async (e,data =[])=>{
  // const con=await mysql.createConnection({host:'192.168.2.111',database:'punto_verde_v2',user:'dev_pv',password:'pss_dEv_pv_18'});

  const con= await db;
  
  let {insertId}=await con.query(`INSERT INTO autos_usuario(cve_accion,cve_socio,tipo,marca,modelo,color,placas,tag,repuve_tag,fecha_registro,estatus,folio_pago_tag,capacidad) VALUES(?,?,?,?,?,?,?,?,?,CURDATE(),1,?,?)`,data);

  // con.end();

  e.returnValue=insertId;
})