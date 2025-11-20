
import { ResumeData, User } from '../types';

const STORAGE_KEY = 'resume_builder_users';
const CURRENT_USER_KEY = 'resume_builder_current_user';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    // Simple mock authentication
    const user = Object.values(users).find((u: any) => u.email === email && u.password === password) as any;
    
    if (!user) throw new Error('Invalid email or password');
    
    const { password: _, ...safeUser } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    if (Object.values(users).some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = { 
      id: crypto.randomUUID(), 
      email, 
      password, 
      name, 
      isPro: false, 
      savedResume: null 
    };
    
    users[newUser.id] = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  loginWithGoogle: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const email = "alex.morgan@gmail.com"; // Simulated Google User
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    let user = Object.values(users).find((u: any) => u.email === email) as any;
    
    if (!user) {
        user = { 
          id: "google_user_" + crypto.randomUUID(), 
          email, 
          password: "", 
          name: "Alex Morgan", 
          isPro: false, 
          savedResume: null 
        };
        users[user.id] = user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    
    const { password: _, ...safeUser } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(CURRENT_USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  saveResume: async (userId: string, data: ResumeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    // Find user by ID directly from storage map
    const userKey = Object.keys(users).find(key => users[key].id === userId);
    
    if (userKey) {
        users[userKey].savedResume = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  },

  getResume: async (userId: string): Promise<ResumeData | null> => {
     const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
     const user = Object.values(users).find((u: any) => u.id === userId) as any;
     return user?.savedResume || null;
  },
  
  upgradeUser: async (userId: string) => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const userKey = Object.keys(users).find(key => users[key].id === userId);
      
      if (userKey) {
          users[userKey].isPro = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
          
          // Update current session if it matches
          const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
          if (currentUser.id === userId) {
              currentUser.isPro = true;
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
          }
      }
  }
};
