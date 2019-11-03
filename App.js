import React from 'react';
import { Alert, Button, Image, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as FileManager from  './app/utils/FileManager';
import Toast, {DURATION} from 'react-native-easy-toast';
import { Message } from './app/utils/Messages';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { 
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger, } from 'react-native-popup-menu';

import { firebaseApp } from './app/utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);
const PDFICON = require('./assets/pdf-icon.png');

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      displayName: '',
      path: 'https://drive.google.com/file/d/0B1HDBL7Husg1aU43U2p5NE9jc1V2UlJxZk1iQVVrc2JwcG44/view?usp=sharing',
      image: null,
      displayImage: null,
      download: 'https://firebasestorage.googleapis.com/v0/b/uploadfiles-ba89c.appspot.com/o/mis_imagenes%2Feugeniabahitpooymvcenphp.pdf?alt=media&token=aa0fd2ff-dbb6-4d9b-a231-54273228dc41',
      docs: [
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'}
      ],
      downloadProgress: '',
      headerBase64: '',
      dataBase64: '',
      size: '',
      type: '',
      ext: '',
      // documento pdf base64 para pruebas: name prueba15.pdf
      base64: "JVBERi0xLjMKJeLjz9MKMSAwIG9iajw8L0ZpbHRlci9TdGFuZGFyZC9PPDc3MjQ3ZTMzNDUxMWU0MDc0NTA1ZjcyNjc0ZjYwYWJkMjM3MDJiMGEzNzE0MDFmYmVhOTYyYmExNjQ1ZWUzY2Q+L1U8ZDg5YzM0NGJlNDEwMDBlZDQxODE1MjFhYmNmNmZiMTVkNDlmMjE2YjgwYjI4ZjRlMjZlY2RiZjU4YzMxZGEzOT4vUCAtNjAvViAxL1IgMj4+ZW5kb2JqCjIgMCBvYmo8PC9Qcm9kdWNlcjxmZTgyMWIzMzAyZDk5YjBmZTU3ODc5NDExZWYzNDk5YjM4NjkzZWNlZDAzZGM2YjU0OWQ5ZGRhZGYyY2RhMDQ4OTlhZjQ2YWZjMWIyYzc4NTVlN2ZkZGZhZDA2Zjc0YmYxNTY4ZTVjZTMwMmMwMjQ1YjE2NmEzN2U2NDVlM2QyY2JjODRiZGU0N2RiZDlkYmUxM2VjNWZmMDBmOGZhZD4vQ3JlYXRpb25EYXRlPGQyY2M0NDZmNTc4ZmM4MTdlNDZlNzM1ZDFmZjM1YmU5N2EyOTczOGM4OT4+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9FbmNvZGluZy9EaWZmZXJlbmNlc1sgMzIvc3BhY2UvZXhjbGFtL3F1b3RlZGJsL251bWJlcnNpZ24vZG9sbGFyL3BlcmNlbnQvYW1wZXJzYW5kL3F1b3Rlc2luZ2xlL3BhcmVubGVmdC9wYXJlbnJpZ2h0L2FzdGVyaXNrL3BsdXMvY29tbWEvbWludXMvcGVyaW9kL3NsYXNoL3plcm8vb25lL3R3by90aHJlZS9mb3VyL2ZpdmUvc2l4L3NldmVuL2VpZ2h0L25pbmUvY29sb24vc2VtaWNvbG9uL2xlc3MvZXF1YWwvZ3JlYXRlci9xdWVzdGlvbi9hdC9BL0IvQy9EL0UvRi9HL0gvSS9KL0svTC9NL04vTy9QL1EvUi9TL1QvVS9WL1cvWC9ZL1ovYnJhY2tldGxlZnQvYmFja3NsYXNoL2JyYWNrZXRyaWdodC9hc2NpaWNpcmN1bS91bmRlcnNjb3JlL2dyYXZlL2EvYi9jL2QvZS9mL2cvaC9pL2ovay9sL20vbi9vL3AvcS9yL3MvdC91L3Yvdy94L3kvei9icmFjZWxlZnQvYmFyL2JyYWNlcmlnaHQvYXNjaWl0aWxkZSAxMjgvRXVybyAxMzAvcXVvdGVzaW5nbGJhc2UvZmxvcmluL3F1b3RlZGJsYmFzZS9lbGxpcHNpcy9kYWdnZXIvZGFnZ2VyZGJsL2NpcmN1bWZsZXgvcGVydGhvdXNhbmQvU2Nhcm9uL2d1aWxzaW5nbGxlZnQvT0UgMTQ1L3F1b3RlbGVmdC9xdW90ZXJpZ2h0L3F1b3RlZGJsbGVmdC9xdW90ZWRibHJpZ2h0L2J1bGxldC9lbmRhc2gvZW1kYXNoL3RpbGRlL3RyYWRlbWFyay9zY2Fyb24vZ3VpbHNpbmdscmlnaHQvb2UgMTU5L1lkaWVyZXNpcy9zcGFjZS9leGNsYW1kb3duL2NlbnQvc3RlcmxpbmcvY3VycmVuY3kveWVuL2Jyb2tlbmJhci9zZWN0aW9uL2RpZXJlc2lzL2NvcHlyaWdodC9vcmRmZW1pbmluZS9ndWlsbGVtb3RsZWZ0L2xvZ2ljYWxub3QvaHlwaGVuL3JlZ2lzdGVyZWQvbWFjcm9uL2RlZ3JlZS9wbHVzbWludXMvdHdvc3VwZXJpb3IvdGhyZWVzdXBlcmlvci9hY3V0ZS9tdS9wYXJhZ3JhcGgvcGVyaW9kY2VudGVyZWQvY2VkaWxsYS9vbmVzdXBlcmlvci9vcmRtYXNjdWxpbmUvZ3VpbGxlbW90cmlnaHQvb25lcXVhcnRlci9vbmVoYWxmL3RocmVlcXVhcnRlcnMvcXVlc3Rpb25kb3duL0FncmF2ZS9BYWN1dGUvQWNpcmN1bWZsZXgvQXRpbGRlL0FkaWVyZXNpcy9BcmluZy9BRS9DY2VkaWxsYS9FZ3JhdmUvRWFjdXRlL0VjaXJjdW1mbGV4L0VkaWVyZXNpcy9JZ3JhdmUvSWFjdXRlL0ljaXJjdW1mbGV4L0lkaWVyZXNpcy9FdGgvTnRpbGRlL09ncmF2ZS9PYWN1dGUvT2NpcmN1bWZsZXgvT3RpbGRlL09kaWVyZXNpcy9tdWx0aXBseS9Pc2xhc2gvVWdyYXZlL1VhY3V0ZS9VY2lyY3VtZmxleC9VZGllcmVzaXMvWWFjdXRlL1Rob3JuL2dlcm1hbmRibHMvYWdyYXZlL2FhY3V0ZS9hY2lyY3VtZmxleC9hdGlsZGUvYWRpZXJlc2lzL2FyaW5nL2FlL2NjZWRpbGxhL2VncmF2ZS9lYWN1dGUvZWNpcmN1bWZsZXgvZWRpZXJlc2lzL2lncmF2ZS9pYWN1dGUvaWNpcmN1bWZsZXgvaWRpZXJlc2lzL2V0aC9udGlsZGUvb2dyYXZlL29hY3V0ZS9vY2lyY3VtZmxleC9vdGlsZGUvb2RpZXJlc2lzL2RpdmlkZS9vc2xhc2gvdWdyYXZlL3VhY3V0ZS91Y2lyY3VtZmxleC91ZGllcmVzaXMveWFjdXRlL3Rob3JuL3lkaWVyZXNpc10+PmVuZG9iago0IDAgb2JqPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvQ291cmllci9FbmNvZGluZyAzIDAgUj4+ZW5kb2JqCjUgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9UaW1lcy1Sb21hbi9FbmNvZGluZyAzIDAgUj4+ZW5kb2JqCjYgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcgMyAwIFI+PmVuZG9iago3IDAgb2JqPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGQvRW5jb2RpbmcgMyAwIFI+PmVuZG9iago4IDAgb2JqPDwvVHlwZS9YT2JqZWN0L1N1YnR5cGUvSW1hZ2UvQ29sb3JTcGFjZVsvSW5kZXhlZC9EZXZpY2VSR0IgMTxGNTM2NzFGMUFDMzY+XS9JbnRlcnBvbGF0ZSB0cnVlL0ZpbHRlci9GbGF0ZURlY29kZS9XaWR0aCAxL0hlaWdodCAxL0JpdHNQZXJDb21wb25lbnQgMS9MZW5ndGggOSAgICAgICAgID4+c3RyZWFtCo03EvGsNupXF2VuZHN0cmVhbQplbmRvYmoKOSAwIG9iajw8L1R5cGUvWE9iamVjdC9TdWJ0eXBlL0ltYWdlL0NvbG9yU3BhY2VbL0luZGV4ZWQvRGV2aWNlUkdCIDE8MjEzMjA1OUJFNUJDPl0vSW50ZXJwb2xhdGUgdHJ1ZS9GaWx0ZXIvRmxhdGVEZWNvZGUvV2lkdGggMS9IZWlnaHQgMS9CaXRzUGVyQ29tcG9uZW50IDEvTGVuZ3RoIDkgICAgICAgICA+PnN0cmVhbQqmzJmb5bw55vFlbmRzdHJlYW0KZW5kb2JqCjEwIDAgb2JqPDwvUy9VUkkvVVJJPGQwMzRmNDVjM2EyZjg4Zjk1MTY4OTEwOGJhNTM1YTJmY2Y+Pj5lbmRvYmoKMTEgMCBvYmo8PC9TdWJ0eXBlL0xpbmsvUmVjdFsyOTEuNiA0MjYuOCAzMzMuNiA0MzcuOF0vQm9yZGVyWzAgMCAwXS9BIDEwIDAgUj4+ZW5kb2JqCjEyIDAgb2JqWzExIDAgUl1lbmRvYmoKMTMgMCBvYmo8PC9EZXN0cyAxNCAwIFI+PmVuZG9iagoxNCAwIG9iajw8L0tpZHNbMTUgMCBSXT4+ZW5kb2JqCjE1IDAgb2JqPDwvTGltaXRzWzxlODJmYmY4YWJkZjczMmVmZjY5MmUyMGVmYzg0NGU3ZGFiZTQ3MDAxNjA+PGU4MmZiZjhhYmRmNzMyZWZmNjkyZTIwZWZjODQ0ZTdkYWJlNDcwMDE2MD5dL05hbWVzWzxlODJmYmY4YWJkZjczMmVmZjY5MmUyMGVmYzg0NGU3ZGFiZTQ3MDAxNjA+MTYgMCBSXT4+ZW5kb2JqCjE2IDAgb2JqPDwvRFsxOCAwIFIvWFlaIDAgNzM0IDBdPj5lbmRvYmoKMTcgMCBvYmo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sxOCAwIFIKXT4+ZW5kb2JqCjE4IDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAxNyAwIFIvQ29udGVudHMgMTkgMCBSL01lZGlhQm94WzAgMCA1OTUgNzkyXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREYvVGV4dC9JbWFnZUIvSW1hZ2VDL0ltYWdlSV0vRm9udDw8L0YwIDQgMCBSL0Y0IDUgMCBSL0Y4IDYgMCBSL0Y5IDcgMCBSPj4vWE9iamVjdDw8L0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4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ZW5kb2JqCnhyZWYKMCAyMSAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAxOTkgMDAwMDAgbiAKMDAwMDAwMDQ0MyAwMDAwMCBuIAowMDAwMDAyMDA5IDAwMDAwIG4gCjAwMDAwMDIwODMgMDAwMDAgbiAKMDAwMDAwMjE2MSAwMDAwMCBuIAowMDAwMDAyMjM3IDAwMDAwIG4gCjAwMDAwMDIzMTggMDAwMDAgbiAKMDAwMDAwMjUyNiAwMDAwMCBuIAowMDAwMDAyNzM0IDAwMDAwIG4gCjAwMDAwMDI3OTkgMDAwMDAgbiAKMDAwMDAwMjg4NCAwMDAwMCBuIAowMDAwMDAyOTA3IDAwMDAwIG4gCjAwMDAwMDI5MzkgMDAwMDAgbiAKMDAwMDAwMjk3MSAwMDAwMCBuIAowMDAwMDAzMTQ1IDAwMDAwIG4gCjAwMDAwMDMxODYgMDAwMDAgbiAKMDAwMDAwMzIzOCAwMDAwMCBuIAowMDAwMDA1NTE0IDAwMDAwIG4gCjAwMDAwMDc5NjUgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDIxL1Jvb3QgMjAgMCBSL0luZm8gMiAwIFIvSURbPGEyM2Y0MWU5OTE3NTYxNmVjZjU3YzkwNDZkMTc0ODk1PjxhMjNmNDFlOTkxNzU2MTZlY2Y1N2M5MDQ2ZDE3NDg5NT5dL0VuY3J5cHQgMSAwIFI+PgpzdGFydHhyZWYKODEwNwolJUVPRgo=",
      data: [
        {
          nombreArchivo: "Prueba15.pdf",
          type: "application/pdf",
          mime: "pdf",
          dataArchivo: "data:application/pdf;base64",
          size: 62428
        },
        {
          nombreArchivo: "Prueba15.pdf",
          type: "image/jpg",
          mime: "pdf",
          dataArchivo: "data:application/pdf;base64",
          size: 62428
        }
      ]
    }


  }

  componentDidMount() {
    // Solicitamos permisos para la cámara en dispositivos iOS: Añadiendo un mensaje en caso de no ser consedido.
    FileManager.getPermissionAsync('Lo sentimos, ¡necesitamos permisos de cámara para hacer que esto funcione!');

  }

  _validateFileNumber = () => {
    console.log(this.state.data.length);
    return this.state.data.length >= 5 ? false : true;
  }

  /**
   * 
   * Valida la extensión del tipo de archivo soportado
   * params: strExt (string de la extensión del archivo)
   * return: booleam (puede ser true/false en caso de que la extensión exista o no)
   * 
   * */ 
  _validateFileFormat = strExt => {
    let arryExts = ['jpg', 'jpeg', 'png', 'pdf'];
    return arryExts.includes(strExt);

  }

  _validateFileSize = bytes => {
    let megas = bytes/1048576;
    console.log("Tamaño del Archivo :: >> ", megas.toFixed(2));
    return megas.toFixed(2) <= 1 ? true : false;
  }

  _loadFile = async () => {
    FileManager.loadFile(this.state.path, this.state.name).then(
      (remotePath) => {
        console.log('Todo correcto');
        console.log(remotePath);
      }
    ).catch(error => {
      console.log(error);
    });

  }

  _downloadFile = () => {
    const uri = this.state.download;
    let fileUri = FileSystem.documentDirectory + "prueba.pdf";

    FileManager.downloadFile(uri, fileUri, this._callback);
  }

  _callback = downloadProgress => {
    const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100.0;
    this.setState({
      downloadProgress: progress,
    }, () => { this.state.downloadProgress === 100 ? this.refs.toast.show('Archivo descargado...') : null  });
  };

  _loadDocument = async () => {
    if(this._validateFileNumber()){
      let result = await FileManager.loadDocument();

      if(this._validateFileSize(result.size)){
        console.log(result.uri);
        console.log(result);

        this._validateFileFormat(result.ext) ?
          FileManager.validateImageFormat(result.ext) ?
            this.setState({ 
              name: result.name,
              image: result.uri, 
              path: result.uri,   
              type: result.type,
              ext: result.ext,
              headerBase64: `data:${result.type}/${result.ext};base64,`,
              dataBase64: result.base64,
              size: result.size   
            })
          :
            this.setState({ 
              name: result.name,
              path: result.uri,
              image: PDFICON, 
              type: result.type,
              ext: result.ext,
              headerBase64: `data:${result.type}/${result.ext};base64,`,
              dataBase64: result.base64,
              size: result.size         
            })
        : Alert.alert(Message.fileFormat.title, Message.fileFormat.text);

      }else{
        Alert.alert(Message.fileSizeLimit.title, Message.fileSizeLimit.text);
      }
    }else{
      Alert.alert(Message.fileLimite.title, Message.fileLimite.text)
    }
  };    

  /**
   * Nota: Validar que las imagenes tomadas se puedan reutilizar al cargarse/recuperarse
   */
  _takePicture = async () => {
    if(this._validateFileNumber()){
      let result = await FileManager.takePicture(true);
      let fileName = this._createTempName('CAM');
      console.log("Tamaño de la Imagen :: >>", this._validateFileSize(result.size));
      console.log(result);
      
      let fileUri = await FileManager.convertBase64ToFile(result.base64, `${fileName}.${result.ext}`);
      console.log("Path :: >> ", fileUri);

      if (!result.cancelled) {
        this.setState({ 
          name: `${fileName}.${result.ext}`,
          image: fileUri,    
          path: fileUri,
          type: result.type,
          ext: result.ext,
          headerBase64: `data:${result.type}/${result.ext};base64,`,
          dataBase64: result.base64,
          size: result.size    
        });
      }
    }else{
      Alert.alert(Message.fileLimite.title, Message.fileLimite.text)
    }
  };

  _createTempName = media => {
    let date = new Date();
    return `${media}_${date.getDate()}${date.getDay()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  }

  _addFile = () => {
    this._validateFileNumber() ?
      this.setState({
        data: [
          ...this.state.data,
          {
            nombreArchivo: this.state.name,
            type: `${this.state.type}/${this.state.ext}`,
            dataArchivo: 'aqui el base64', //this.state.dataBase64,
            size: this.state.size
          }
        ]
      }, this.setState({
          name: '',
          path: '',
          image: null, 
          type: '',
          ext: '',
          headerBase64: '',
          dataBase64: '',
          size: ''         
      }, () => console.log(" Data Ready :: >> ", this.state.data)
      ))
    : Alert.alert(Message.fileLimite.title, Message.fileLimite.text)
  }

  _onChangeFileName = (text) => {
    this.setState({
      ...this.state,
      name: text
    }, () => console.log(this.state.name));
  }

  _showOptionsMenu = () => (
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />
      <MenuOptions>
        <MenuOption value={1} text='One' />
        <MenuOption value={2}>
          <Text style={{color: 'red'}}>Two</Text>
        </MenuOption>
        <MenuOption value={3} disabled={true} text='Three' />
      </MenuOptions>
    </Menu>
  )

  render() {
    let { image, type } = this.state;

    return (
      <MenuProvider>
      <View style={{ flex: 1, justifyContent:'center' }}>
        
        <View style={{ backgroundColor:'gray', alignItems:'center', justifyContent:'center', height: 250, borderTopLeftRadius:20, borderTopRightRadius:20, marginTop:40 }}>  
          { 
            image != '' && image != null ?
              image && type == 'image' ? 
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> 
              : <Image source={ image } style={{ width: 150, height: 150 }} /> 
            : null
          }
          {/* <Text> { this.state.name ? this.state.name : this.state.displayName } </Text> */}
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => this._onChangeFileName(text)}
            value={this.state.name}
          />

          <View style={{ flexDirection:'row', justifyContent: 'space-between', marginBottom:15, position:'absolute', left:0, right:0 }}>
            <Animatable.View animation="fadeInLeft" direction="alternate">
              <TouchableOpacity
                style={ styles.btnAddFile }
                activeOpacity={0.8}
                onPress={this._takePicture}
              >
                  <View style={ styles.btnAddFileRightArrow }></View>

                    <Text style={{ textAlign:'center', }} >
                      <MaterialIcons name="photo-camera" size={32} color="#565656" />
                    </Text>
              </TouchableOpacity>
            </Animatable.View>

              <Animatable.View animation="fadeInRight" direction="alternate">
                <TouchableOpacity
                  style={ styles.btnAddFile }
                  activeOpacity={0.8}
                  onPress={this._loadDocument}
                >
                    <View style={ styles.btnAddFileLeftArrow }></View>

                      <Text style={{ textAlign:'center', }} >
                        <MaterialIcons name="file-upload" size={32} color="#565656" />
                      </Text>
                </TouchableOpacity>
              </Animatable.View>
          </View>

        </View>

        <TouchableOpacity
        style={{ 
          width:'100%', 
          height:25, 
          backgroundColor:'green', 
          justifyContent:'center', 
          flexDirection:'column', 
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50
        }}
          activeOpacity={0.8}
          onPress={this._addFile}
        >
          <View style={{ justifyContent:'center', alignItems:'center', flexDirection:'row', }}>
            <AntDesign name="pluscircleo" size={15} color="#ffffff" />
            <Text style={{ width:'30%', textAlign:'center', color:'#fff', }}>
                Añadir a la lista
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection:'row', justifyContent: 'space-between', marginBottom:15, }}> 

          {/* <Button
            title="Descargar PDF"
            onPress={this._convertBase64ToFile}
          />     */}
 
          {/*<Button
          style={{ borderRadius:15 }}
            title="Descargar"
            onPress={this._downloadFile}
          /> */}

        </View>

        {/* <View style={{ flexDirection:'row', justifyContent: 'space-between', marginBottom:15, }}>  
          <Button
            title="Añadir"
            onPress={this._addFile}
          />
        </View> */}

        <FlatList
          data={this.state.data}
          renderItem={({item}) => (
              <View style={{ 
                justifyContent:'flex-start', 
                flexDirection:'row', 
                borderBottomColor:'#dddddd', 
                borderBottomWidth:1, 
                marginLeft:15, 
                marginRight:15,
                paddingBottom:10,
                paddingTop:10,
                alignItems:'center' 
              }} >
                {item.type === 'application/pdf' ?
                  <AntDesign style={{ marginRight:8 }} name="pdffile1" size={17} color="#000000" />
                :
                  <FontAwesome style={{ marginRight:8 }} name="file-picture-o" size={17} color="#000000" /> 
                }
                
                <Text style={{ textAlignVertical:'center', }}>
                 {item.nombreArchivo}
                </Text>

                <View style={{ position:'absolute', top:10, right: 15 }} >
                  <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                    <MenuTrigger text={<SimpleLineIcons style={{ width:15, height:15 }} name="options-vertical" size={17} color="gray" />} />
                    <MenuOptions>
                      <MenuOption value={1} text='Detalle' />
                      <MenuOption value={2}>
                        <Text style={{color: 'red'}}>Editar</Text>
                      </MenuOption>
                      <MenuOption value={3} disabled={true} text='Eliminar' />
                    </MenuOptions>
                  </Menu>
                </View>
              </View>
            )}
          keyExtractor={() => Math.random().toString(36).substr(2, 9)}
        />

        <Toast ref="toast"/>
        <Button
            style={{ width:'90%', marginBottom:15, marginLeft:15, marginRight:15, backgroundColor:'orange' }}
            title="Enviar"
            onPress={this._loadFile}
          />
      </View>
      </MenuProvider>
    );
  };


}

const styles = StyleSheet.create({
  btnAddFile:{
    backgroundColor:'#e1e1e1', 
    width: 50, 
    height:35, 
    justifyContent:'center',
    borderTopLeftRadius:2,
    borderBottomLeftRadius:2
  },
  btnAddFileRightArrow:{
    overflow: 'hidden',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 25,
    borderBottomWidth: 25,
    borderRightColor: 'transparent',
    borderBottomColor: '#e1e1e1',
    transform:[{ rotate: '225deg' }],
    position:'absolute',
    top:5,
    right:-12.4,
  },  
  textPicture:{

  },
  btnAddFileLeftArrow: {
    overflow: 'hidden',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 25,
    borderBottomWidth: 25,
    borderRightColor: 'transparent',
    borderBottomColor: '#e1e1e1',
    transform:[{ rotate: '45deg' }],
    position:'absolute',
    top:5,
    left:-12,
  },  
  textUploadFile: {

  }

});

