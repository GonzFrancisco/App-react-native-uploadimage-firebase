import * as firebase from "firebase";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export const showMessage = () => console.log(" ** FileManager ");

/**
 * 
 * Solicita los Permisos de Acceso a la Cámara en iOS
 * params: msgError 
 * return: none
 * 
 * */ 
export const getPermissionAsync = async (msgError) => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert(msgError);
    }
  }
}

/**
 * 
 * Convertir Blob a Base64
 * params: blob
 * return: promise blob
 * 
 * */ 
export const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    let reader = new FileReader() ;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
    reader.onerror = error => reject(error);
});

/**
 * 
 * Convertir archivo a Base64
 * params: localURL --> file://
 * return: promise base64
 * 
 * */ 
export const convertFileToBase64 = uri => new Promise((resolve, reject) => {
    fetch(uri)
    .then( fetchResponse => fetchResponse.blob())
    .then( blob => {
      convertBlobToBase64(blob).then(
        base64 => resolve(base64)
      );
    }).catch( error => reject(error));
});

/**
 * 
 * Convertir Base64 a archivo y Guardarlo en el Dispositivo
 * params: base64 , fileNamme (fileName con su extensión)
 * return: promise base64
 * 
 * */ 
export const convertBase64ToFile = async (base64, fileName) => {
  let fileUri = FileSystem.documentDirectory + fileName;

  // console.log(fileUri);

  await FileSystem.writeAsStringAsync(fileUri, base64, {encoding: FileSystem.EncodingType.Base64});
  saveFile(fileUri);

  return fileUri;

}

/**
 * 
 * Almacena el archivo ubicado en un ruta temporal en el fichero Download del Dispositivo
 * params: fileUri --> file://
 * return: none
 * 
 * */ 
export const saveFile = async (fileUri: string) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await MediaLibrary.createAlbumAsync("Download", asset, false)
  }
}

/**
 * 
 * Almacena el archivo ubicado en un ruta temporal en el fichero Download del Dispositivo
 * params: fileUri --> file:// , fileName (nombre de archivo con su extensión)
 * return: none
 * 
 * */ 
export const loadFile = async (fileUri, fileName) => {
  return await uploadFile(fileUri, fileName, 'mis_imagenes');
}

/**
 * 
 * Almacena el archivo ubicado en un ruta temporal en el fichero Download del Dispositivo
 * params: fileUri --> file:// , fileName (nombre de archivo con su extensión)
 * return: none
 * 
 * */ 
export const uploadFile = async (uri, nameImage, folder) => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
              resolve(xhr.response);
          }
      };

      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
  }).then( async resolve => {
      const ref = firebase.storage().ref().child(`${folder}/${nameImage}`);
      await ref.put(resolve);

      return await firebase.storage().ref(`${folder}/${nameImage}`).getDownloadURL()
      .then( resolve => {
          return resolve;
      }).catch(error => {
          console.log(error);
      });

  }).catch(error => {
      console.log(error);
  });
}

/**
 * 
 * Carga un archivo desde el dispositivo.
 * params: fileUri --> file:// , fileName (nombre de archivo con su extensión)
 * return: object :: fileName, size, uri, type y base64 (*opcional)
 * 
 * */ 
export const loadDocument = async () => {
  let result = await DocumentPicker.getDocumentAsync();
  let type = result.uri.split('.');
  result.ext = type[type.length - 1];

  // let base64 = await convertFileToBase64(result.uri);
  // result.base64 = base64;

  if(result.ext === 'jpg' || result.ext === 'jpeg' || result.ext === 'png'){
    result.type = 'image';
  }else{
    result.type = 'application';
  }
  return result;

};   

/**
 * 
 * Activa la cámara para tomar una foto y recuperar la misma
 * params: blmBase64 (determina si añade o no la versión base64 de la foto)
 * return: object ::
 * 
 * */ 
export const takePicture = async (blmBase64=false) => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    base64 : blmBase64,
  }).catch(error => console.log(error));

  let fileSize = await getFileSize(result.uri);
  result.size = fileSize.size;

  let type = result.uri.split('.');
  result.ext = type[type.length - 1];

  return result; // result.base64 --> Así recuperamos el base64

};

/**
 * 
 * Permite cargar un archivo de tipo imagen desde el dispositivo
 * params: blmBase64 (determina si añade o no la versión base64 de la imagen)
 * return: object ::
 * 
 * */ 
export const loadImage = async (blmBase64=false) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    base64 : blmBase64,
  });

  let fileSize = await getFileSize(result.uri);
  result.size = fileSize.size;

  let type = result.uri.split('.');
  result.ext = type[type.length - 1];

  return result; // result.base64 --> Así recuperamos el base64

};

/**
 * 
 * Obtener el tamaño/peso/size de un archivo
 * params: fileUri , object :: md5, size
 * return: size
 * 
 * */ 
export const getFileSize = async (fileUri) => {
  let result = await FileSystem.getInfoAsync(fileUri, {size:true});
  return result;
}
 
/**
 * 
 * Valida la extensión de las imagenes soportadas
 * params: strExt (string de la extensión del archivo)
 * return: booleam (puede ser true/false en caso de que la extensión exista o no)
 * 
 * */ 
export const validateImageFormat = strExt => {
  let arrayExts = ['jpg', 'jpeg', 'png'];
  return arrayExts.includes(strExt);
}

/**
 * 
 * Descargar un archivo desde una url remota
 * params: remoteURL, fileURL, callback
 * return: Obtiene el archivo y lo almacena en la carpera Download
 * 
 * */ 
export const downloadFile = (uri, fileUri, callback) => {
  let downloadResumable = FileSystem.createDownloadResumable(
    uri,
    fileUri,
    {},
    callback
  );  

  downloadResumable.downloadAsync(uri, fileUri)
  .then(({ uri }) => { 
      saveFile(uri); // --> use for save file in devices
    })
    .catch(error => {
      console.error(error);
    })
}