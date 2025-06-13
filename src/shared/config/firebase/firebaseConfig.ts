import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'; // Importe o módulo de autenticação
import '@react-native-firebase/firestore';
// Apenas para FieldValue se ainda precisar dela de 'firebase'
import firebaseNamespaced from '@react-native-firebase/app';

const db = firebase.firestore();
const auth = firebase.auth(); // Obtenha a instância do Auth

export const FieldValue = firebaseNamespaced.firestore.FieldValue;

export { auth, db, firebase };
