
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (user: User, password?: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // For Demo mode, check localStorage
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'مستخدم',
              email: firebaseUser.email || '',
              role: UserRole.SEEKER
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    let demoUser: User | null = null;
    if (email === 'admin' && password === 'admin') {
      demoUser = { id: 'admin', name: 'مدير النظام (Demo)', email: 'admin', role: UserRole.ADMIN };
    } else if (email === 'seeker' && password === 'seeker') {
      demoUser = { id: 'seeker', name: 'أحمد الباحث (Demo)', email: 'seeker', role: UserRole.SEEKER, governorate: 'بغداد' };
    } else if (email === 'employer' && password === 'employer') {
      demoUser = { 
        id: 'employer',
        name: 'سارة محمد (Demo)', 
        email: 'employer', 
        role: UserRole.RECRUITER, 
        companyName: 'شركة النهرين للتقنية',
        governorate: 'البصرة'
      };
    }

    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      return true;
    }

    if (!isFirebaseConfigured) return false;

    try {
      const loginEmail = email.includes('@') ? email : `${email}@iraqjobs.com`;
      await signInWithEmailAndPassword(auth, loginEmail, password || '');
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const register = async (userData: User, password?: string) => {
    if (!isFirebaseConfigured) {
      setUser(userData);
      localStorage.setItem('demo_user', JSON.stringify(userData));
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, userData.email, password || 'password123');
      const firebaseUser = res.user;
      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      setUser({ id: firebaseUser.uid, ...userData });
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    if (isFirebaseConfigured && user.id) {
      try {
        await updateDoc(doc(db, "users", user.id), updates as any);
      } catch (error) {
        console.error("Update Profile Error:", error);
      }
    } else {
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    if (isFirebaseConfigured) signOut(auth);
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
