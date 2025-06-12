import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { UserProfile } from '../../store/auth/interfaces';

const WEB_CLIENT_ID = '1084557519382-a8netfgn2v6bootlmkfaq95jjcta2in6.apps.googleusercontent.com'; // <-- SUBSTITUA AQUI!

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true,
});

export const firebaseAuthService = {
  // Função para fazer login com Google
  signInWithGoogle: async (): Promise<UserProfile | null> => {
    try {
      // Obter o token de ID do usuário do Google
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const idToken = (await GoogleSignin.signIn()).data?.idToken;

      if (!idToken) {
        throw new Error('No Google ID token found.');
      }

      // Criar uma credencial Firebase com o token do Google
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Fazer login no Firebase com a credencial
      const userCredential = await auth().signInWithCredential(googleCredential);

      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      if (error.code === 'RNGoogleSignin/SIGN_IN_CANCELLED') {
        throw new Error('Login com Google cancelado.');
      }
      throw new Error(`Falha no login com Google: ${error.message || error.code}`);
    }
  },

  // Função para fazer logout
  signOut: async (): Promise<void> => {
    try {
      await GoogleSignin.revokeAccess(); // Opcional: revogar o acesso do Google (se quiser que o usuário escolha a conta novamente)
      await GoogleSignin.signOut(); // Opcional: sair da conta Google
      await auth().signOut(); // Sair do Firebase
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw new Error(`Falha no logout: ${error.message || error.code}`);
    }
  },

  // Observa o estado de autenticação do Firebase (se o usuário está logado ou não)
  onAuthStateChanged: (callback: (user: UserProfile | null) => void) => {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  },
};
