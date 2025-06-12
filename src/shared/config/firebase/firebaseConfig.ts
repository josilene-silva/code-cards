import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'; // Importe o módulo de autenticação
import '@react-native-firebase/firestore';

const db = firebase.firestore();
const auth = firebase.auth(); // Obtenha a instância do Auth

export { auth, db, firebase };
