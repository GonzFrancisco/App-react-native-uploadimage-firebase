import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { firebaseApp } from './app/utils/Firebase';

import { uploadImage } from './app/utils/UploadImage';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/8536/production/_103520143_gettyimages-908714708.jpg'
    }
  }

  _loadImage = () => {
    uploadImage(this.state.image, 'foto_prueba.jpg', 'mis_imagenes').then(
      () => {
        console.log('Todo correcto');
      }
    ).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title='subir imagen'
          onPress={ () => this._loadImage() }
        />
      </View>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
