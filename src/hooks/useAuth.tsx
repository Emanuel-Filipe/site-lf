import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AdminUser = {
  email: string;
};

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const ADMIN_EMAIL = "emanuelelais88@gmail.com";
const ADMIN_PASSWORD = "El17200306!";
const ADMIN_SESSION_KEY = "lais-fitness-admin-session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedSession === ADMIN_EMAIL) {
      setUser({ email: ADMIN_EMAIL });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Email ou senha invalidos.");
    }

    window.localStorage.setItem(ADMIN_SESSION_KEY, ADMIN_EMAIL);
    setUser({ email: ADMIN_EMAIL });
  };

  const signOut = async () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: !!user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
