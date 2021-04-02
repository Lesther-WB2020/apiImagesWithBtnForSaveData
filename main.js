// para crear la ventana de la app como tal
const{app, BrowserWindow} = require('electron')
//para tener comunicacion con el (render)preload-main
const {ipcMain} = require('electron') 
//preload:path line: 18
const path = require('path');
// ORM
const{Sequelize, DataTypes} = require('sequelize');

let ventana;
function createWindow(){
    ventana = new BrowserWindow({
        resizable: false,
        width: 950,
        height: 1000,
        title: 'BUSCADOR DE IMÁGENES',
        webPreferences:{
            preload: path.join(app.getAppPath(),'/src/preload.js')
        }
    })
    ventana.loadFile('./src/render/index.html')
}
app.whenReady().then(createWindow);

const sequelize = new Sequelize('activiad05tds','xitumul','galileo2021',{
    host:'localhost',
    dialect: 'mysql'
});

const tabla = sequelize.define('picture',
    {
        idPictureSaved:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        codigo:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fechaHora:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false 
        },
        tags:{
            type: DataTypes.STRING,
            allowNull: false
        },
        user:{
            type: DataTypes.STRING,
            allowNull: false
        },
        views:{
            type: DataTypes.STRING,
            allowNull: false
        },
        downloads:{
            type: DataTypes.STRING,
            allowNull: false
        },
        linkPicture:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

ipcMain.on('saveData',(event,args) =>{
        tabla.create({
            codigo:args['codigo'],
            type:args['type'],
            tags:args['tags'],
            user:args['user'],
            views:args['views'],
            downloads:args['downloads'],
            linkPicture:args['linkPicture']
        }).then((answer) =>{
            ventana.webContents.send('respuestaByMysqlQuery',`LA FOTOGRAFÍA DEL USUARIO "${args['user']}" FUE REGISTRADA CON ÉXITO`) 
        }).catch((err)=>{
            ventana.webContents.send('respuestaByMysqlQuery',`LA IMÁGEN YA HA SIDO GUARDADA PREVIAMENTE.`) 
        });
        
});

ipcMain.on('IWannaSeeDataSaved',(event,args) =>{
    tabla.findAndCountAll().then((resultados)=>{
        let n = resultados.count;
        // primer elemento -> console.log(resultados.rows[0].dataValues)  
        // ultimo elemento -> console.log(resultados.rows[n-1].dataValues)
        let itemsSaved = new Array();
        for(let i=0;i<n;i++){
            itemsSaved.push(resultados.rows[i].dataValues);
        }
        ventana.webContents.send('replySeeDataSaved',itemsSaved) 
    })
});