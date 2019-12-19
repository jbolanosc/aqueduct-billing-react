import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCx5EPUANhILrtnNd7c9GIdlMLPF3g86_Q",
    authDomain: "asadas-fdff1.firebaseapp.com",
    databaseURL: "https://asadas-fdff1.firebaseio.com",
    projectId: "asadas-fdff1",
    storageBucket: "asadas-fdff1.appspot.com",
    messagingSenderId: "524819605627",
    appId: "1:524819605627:web:cb485c4245567555c65ade",
    measurementId: "G-J1YSLRQB5P"
};
firebase.initializeApp(config);

firebase.firestore();

export default firebase;