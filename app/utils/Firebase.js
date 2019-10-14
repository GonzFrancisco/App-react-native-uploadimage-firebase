import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyD_NHeNfUkdvx1hrbqUwJ4rAww2u7m8IZc",
    authDomain: "uploadfiles-ba89c.firebaseapp.com",
    databaseURL: "https://uploadfiles-ba89c.firebaseio.com",
    projectId: "uploadfiles-ba89c",
    storageBucket: "uploadfiles-ba89c.appspot.com",
    messagingSenderId: "994194975143",
    appId: "1:994194975143:web:f8236cffd336d1124f6e82"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);