
import { ResumeData, User } from '../types';

// --- CONFIGURATION ---
// TOGGLE THIS TO 'true' WHEN YOUR DJANGO SERVER IS RUNNING
const USE_API_BACKEND = false; 

// Your Django API URL (e.g., running locally on port 8000)
const API_BASE_URL = 'http://localhost:8000/api';

// --- STORAGE KEYS ---
const STORAGE_KEY_MOCK = 'resume_builder_users_v2'; // For Mock Mode only
const TOKEN_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_DATA_KEY = 'auth_user_data';

// --- HELPER: MOCK DATABASE (Local Storage) ---
const getMockUsers = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MOCK);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (e) {
    return {};
  }
};

// --- HELPER: API HEADERS ---
const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- HELPER: GOOGLE TOKEN PARSER ---
function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error("Invalid token format");
    }
}

export const authService = {
  // --- AUTHENTICATION ---

  login: async (email: string, password: string): Promise<User> => {
    const cleanEmail = email.toLowerCase().trim();

    if (USE_API_BACKEND) {
      // REAL BACKEND MODE (Django)
      try {
        const response = await fetch(`${API_BASE_URL}/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        // Assuming Django SimpleJWT returns { access: "...", refresh: "..." }
        localStorage.setItem(TOKEN_KEY, data.access);
        localStorage.setItem(REFRESH_KEY, data.refresh);

        // Fetch User Details after getting token
        const userResponse = await fetch(`${API_BASE_URL}/me/`, {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const userData = await userResponse.json();
        
        const safeUser = { ...userData, isPro: userData.is_pro }; // Map backend fields to frontend type
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUser));
        return safeUser;

      } catch (error: any) {
        console.error("API Login Error:", error);
        throw new Error(error.message || "Server unavailable");
      }

    } else {
      // MOCK MODE
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      const user = Object.values(users).find((u: any) => 
        u.email.toLowerCase() === cleanEmail && u.password === password
      ) as any;
      
      if (!user) throw new Error('Invalid credentials');
      
      const { password: _, ...safeUser } = user;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    const cleanEmail = email.toLowerCase().trim();
    
    if (USE_API_BACKEND) {
      // REAL BACKEND MODE
      try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password, name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Signup failed');
        }
        
        // Auto-login after signup
        return authService.login(email, password);
      } catch (error: any) {
        throw new Error(error.message || "Signup failed");
      }

    } else {
      // MOCK MODE
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      
      if (Object.values(users).some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('User already exists');
      }
      
      const newUser = { 
        id: crypto.randomUUID(), 
        email: cleanEmail, 
        password, 
        name: name.trim(), 
        isPro: false, 
        savedResume: null 
      };
      
      users[newUser.id] = newUser;
      localStorage.setItem(STORAGE_KEY_MOCK, JSON.stringify(users));
      
      const { password: _, ...safeUser } = newUser;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
  },

  handleGoogleCredential: async (credential: string): Promise<User> => {
    const payload = parseJwt(credential);
    const email = payload.email.toLowerCase().trim();
    const name = payload.name;
    
    if (USE_API_BACKEND) {
       try {
         const response = await fetch(`${API_BASE_URL}/google-auth/`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ token: credential })
         });
         const data = await response.json();
         localStorage.setItem(TOKEN_KEY, data.access);
         localStorage.setItem(REFRESH_KEY, data.refresh);
         
         const safeUser = { ...data.user, isPro: data.user.is_pro };
         localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUser));
         return safeUser;
       } catch (e) {
         throw new Error("Google Auth with Server Failed");
       }
    } else {
      // Mock Google Auth
      const users = getMockUsers();
      let user = Object.values(users).find((u: any) => u.email === email) as any;
      
      if (!user) {
          user = { 
            id: "google_" + payload.sub, 
            email, 
            password: "", 
            name: name, 
            isPro: false, 
            savedResume: null,
            photoUrl: payload.picture 
          };
          users[user.id] = user;
          localStorage.setItem(STORAGE_KEY_MOCK, JSON.stringify(users));
      }
      
      const { password: _, ...safeUser } = user;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
  },

  logout: () => {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  getCurrentUser: (): User | null => {
    try {
      const u = localStorage.getItem(USER_DATA_KEY);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  // --- RESUME PERSISTENCE ---

  saveResume: async (userId: string, data: ResumeData) => {
    if (USE_API_BACKEND) {
      try {
        await fetch(`${API_BASE_URL}/resume/`, {
          method: 'POST', // or PUT
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
      } catch (e) {
        console.error("Failed to save to server", e);
        throw e;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = getMockUsers();
      const userKey = Object.keys(users).find(key => users[key].id === userId);
      if (userKey) {
        users[userKey].savedResume = data;
        localStorage.setItem(STORAGE_KEY_MOCK, JSON.stringify(users));
      }
    }
  },

  getResume: async (userId: string): Promise<ResumeData | null> => {
    if (USE_API_BACKEND) {
       try {
         const response = await fetch(`${API_BASE_URL}/resume/`, {
           headers: getHeaders()
         });
         if (response.status === 404) return null;
         return await response.json();
       } catch (e) {
         console.error("Failed to fetch resume", e);
         return null;
       }
    } else {
       const users = getMockUsers();
       const user = Object.values(users).find((u: any) => u.id === userId) as any;
       return user?.savedResume || null;
    }
  },
  
  upgradeUser: async (userId: string) => {
      if (USE_API_BACKEND) {
        await fetch(`${API_BASE_URL}/upgrade/`, {
          method: 'POST',
          headers: getHeaders(),
        });
      } else {
        const users = getMockUsers();
        const userKey = Object.keys(users).find(key => users[key].id === userId);
        if (userKey) {
            users[userKey].isPro = true;
            localStorage.setItem(STORAGE_KEY_MOCK, JSON.stringify(users));
        }
      }

      // Update local session
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
          currentUser.isPro = true;
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(currentUser));
      }
  }
};
