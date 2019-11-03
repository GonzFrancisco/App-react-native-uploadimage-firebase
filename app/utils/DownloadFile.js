
export const DownloadFile = async (uri) => {
    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          let blob = xhr.response;
        };
        xhr.open('GET', uri);
        xhr.send();    

    }).then( resolve => {
        console.log(" -- resolve -- ");
        console.log(resolve);
        return resolve;
    }).catch( error => {
        console.log(" -- error -- ");
        console.log(error);
    })
}