// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { firebaseAuthService } from '../api/firebase/authService'; // Importa seu serviço de autenticação
import { UserProfile } from '../store/auth/interfaces';

/**
 * Hook customizado para gerenciar o estado de autenticação do usuário.
 * @returns {{ user: UserProfile | null, initializing: boolean }}
 */
export const useAuth = (): { user: UserProfile | null; initializing: boolean } => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Listener para o estado de autenticação do Firebase
    const subscriber = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber;
  }, []);

  return { user, initializing };
};
