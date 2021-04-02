const {ipcRenderer,contextBridge} = require('electron')
contextBridge.exposeInMainWorld(
    'makeMysqlQuery',
    {
        sendData:
        (objectData) => {ipcRenderer.send('saveData',objectData)}
        ,
        viewDataSaved:
        () => {ipcRenderer.send('IWannaSeeDataSaved')}
        ,
        receiveMessageFromMain: 
        (channel,callback) => {ipcRenderer.on(channel,callback)}
    }
)