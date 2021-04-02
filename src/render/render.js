import {getImages} from '../api.js'
// obtengo todos los parametros/terminos de busqueda
let userSearch = document.getElementById('userSearch');
let orientation = document.getElementById('orientation');
let judgment = document.getElementById('judgment');
// el boton que activara la peticion a la API
let btnSearch = document.getElementById('btnSearch');
// boton para ver los items/pictures guarados
let btnVerGuardados = document.getElementById('btnConsultarDB');
// tabla que mostrara las respuestas
let answerFromUserSearch = document.getElementById('nRowAnswer')
// seteo un eventListener al botón 'buscar' y 'verGuardados'
btnSearch.addEventListener('click',makeRequest);  
btnVerGuardados.addEventListener('click',showItemsSaved);

async function makeRequest(){
        if(userSearch.value == ''){
            alert('TIENES QUÉ LLENAR EL CAMPO DE BÚSQUEDA, DE LO CONTRARIO NO PODEMOS MOSTRARTE IMÁGENES.')
        }else{
            //con base a lo que tiene en el input-text(userSearch) llamo al metodo que eventualmente
            //hace una peticion a la API con los parametros que le evnio.
            getImages(userSearch.value,orientation.value,judgment.value)
            .then((resHTTP) => resHTTP.json())
            .then((resJSON) => {
                    let nElementos = resJSON.hits.length;
                    if((nElementos) == 0){
                        alert('NUESTRO SERVICIO NO ENCONTRÓ NINGUNA COINCIDENCIA CON EL INPUT ESPECIFICADO');
                    }else{
                        //elimino posibles datos anteriores
                        answerFromUserSearch.innerHTML = '';
                        for(let i=0;i<nElementos;i++){
                            // recupero la data en cada position 'i' del array que me devuelven en la propiedad hits.
                            let codigo = resJSON.hits[i]['id'];
                            let type = resJSON.hits[i]['type'];
                            let tags = resJSON.hits[i]['tags'];
                            let user = resJSON.hits[i]['user'];
                            let views = resJSON.hits[i]['views'];
                            let downloads = resJSON.hits[i]['downloads'];
                            let linkPicture = resJSON.hits[i]['largeImageURL']
                                //funcion cuyo objetivo es basicamente mostrar la data en el tableBody html
                                putInfoInTable(codigo,type,tags,user,views,downloads,linkPicture,false);  
                        }
                    }
            })
            .catch(
                (err) => {
                    alert('HUBO UN ERROR EN LA RESPUESTA')
                    console.log(err)
                }
            )
        }
        
}

async function showItemsSaved(){
    window.makeMysqlQuery.viewDataSaved();
}

async function putInfoInTable(codigo,type,tags,user,views,downloads,linkPicture,isAQuery){
       //el boton que me ayudará a guardar información en la DB
    let btnSaveData = document.createElement('input');
    btnSaveData.setAttribute('type','button');
    btnSaveData.setAttribute('value','GUARDAR');
    btnSaveData.setAttribute('id',codigo);
    btnSaveData.setAttribute('class','btn btn-primary btnGuardar');
        
        btnSaveData.addEventListener('click', (event)=>{
            // creo un objeto para eventualmente enviarlo y guardarlo en la Db en el Main Process
            let objectData = {
                "codigo":codigo,
                "type":type,
                "tags":tags,
                "user":user,
                "views":views,
                "downloads":downloads,
                "linkPicture":linkPicture
            }
            window.makeMysqlQuery.sendData(objectData);
                btnSaveData.disabled = true;
        }); 
    //creo una fila para poner dicha data
     let fila = document.createElement('tr');
     fila.setAttribute('scope','row');
     fila.innerHTML += 
      `<td>
            <img src=\"${linkPicture}\" width=\"450px\" heigth=\"200px\"> 
       </td>
       <td>
            <p>
                <strong>AUTOR: </strong>${user} </br>
                <strong>TIPO: </strong>${type} </br>
                <strong>ETIQUETAS: </strong>${tags} </br>
                <strong>VISTAS: </strong>${views} </br>
                <strong>DESCARGAS: </strong>${downloads} </br>
            </p>
        </td>`
        // espero un milisegundo antes de ejecutar esta sentencia ya que el comportamiento asincrónico de JS
        // ejecuta la sentencia:  answerFromUserSearch.appendChild(fila); 
        // antes de validar el "if"
        setTimeout(() => {
            //cuando consultamos la DB, isAQuery es true, por lo tanto solo en ese caso no mostraria un btn para guardar
            //pues la informacion ya está guardada en la DB.
            if(isAQuery==false){
                // agrego el boton a la fila
               fila.appendChild(btnSaveData);
           }
             //agrego la fila al tbody de la tabla.
             answerFromUserSearch.appendChild(fila); 
        }, 1);
        
}

window.makeMysqlQuery.receiveMessageFromMain('respuestaByMysqlQuery',(event,args) => {
    alert(args);
});

window.makeMysqlQuery.receiveMessageFromMain('replySeeDataSaved',(event,args) => {
    //elimino posibles datos anteriores
    answerFromUserSearch.innerHTML = '';
    let nElementos = args.length;
    for(let i=0;i<nElementos;i++){
        let codigo_ = args[i]['codigo'];
        let type_ = args[i]['type'];
        let tags_ = args[i]['tags'];
        let user_ =args[i]['user'];
        let views_= args[i]['views'];
        let downloads_ = args[i]['downloads'];
        let linkPicture_ = args[i]['linkPicture']     
            putInfoInTable(codigo_,type_,tags_,user_,views_,downloads_,linkPicture_,true);  
    }
});