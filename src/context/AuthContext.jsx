// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

// Admin email configuration - store in lowercase for comparison
export const ADMIN_EMAIL = 'admin.servex@gmail.com';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check if user is admin (case-insensitive)
      const adminCheck = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      setIsAdmin(adminCheck);
      setLoading(false);
      
      console.log('Auth state changed:', {
        email: currentUser?.email,
        isAdmin: adminCheck
      });
    });

    return unsubscribe;
  }, []);

  // Register function
  async function register(email, password, name) {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Determine account type
      const isUserAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        accountType: isUserAdmin ? 'Admin' : 'Free',
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Login function
  async function login(email, password) {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Logout function
  async function logout() {
    try {
      setError(null);
      setIsAdmin(false);
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
    isAdmin,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}