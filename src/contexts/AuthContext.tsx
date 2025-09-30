import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '560802312497-o8cumlo0nrvnnpnj79gih6q3e3badtf4.apps.googleusercontent.com',
      offlineAccess: true,
    });

    // Set up auth state listener
    const unsubscribe = auth().onAuthStateChanged(async (_user) => {
      setUser(_user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Starting signUp with email:', email);
      console.log('[AuthContext] Password length:', password?.length);

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const authInstance = auth();
      console.log('[AuthContext] Auth instance:', authInstance ? 'exists' : 'undefined');

      const result = await authInstance.createUserWithEmailAndPassword(email, password);
      console.log('[AuthContext] Sign up successful, user:', result?.user?.uid);
    } catch (error: any) {
      console.error('[AuthContext] Sign up error:', error);
      console.error('[AuthContext] Error code:', error?.code);
      console.error('[AuthContext] Error message:', error?.message);
      console.error('[AuthContext] Full error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      await auth().signInWithCredential(appleCredential);
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      await currentUser.delete();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please sign in again before deleting your account');
      }
      console.error('Delete account error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInWithGoogle,
        signInWithApple,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};