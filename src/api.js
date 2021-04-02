export function getImages(userSearch,orientation,judgment){
    // reemplazo los posibles espacios por signos '+' para buscar todo lo especificado
    // por ejemplo si se ingresa 'perros blancos' = 'perros+blancos' 
    userSearch = userSearch.replace(/ /g,"+");
        let api = 'https://pixabay.com/api/'; 
            let myKey = '16871102-65597edfe2877b02cf1222c0c';
                let language = 'es';
                    return fetch(`${api}?key=${myKey}&lang=${language}&q=${userSearch}&orientation=${orientation}&order=${judgment}`); 
}