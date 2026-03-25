import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminUser = {
  id: string;
  email: string;
};

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAdminUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.email) {
    return { user: null, isAdmin: false };
  }

  const { data, error } = await supabase.rpc("has_role", {
    _user_id: session.user.id,
    _role: "admin",
  });

  if (error || !data) {
    return { user: null, isAdmin: false };
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
    },
    isAdmin: true,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      setLoading(true);
      const authState = await getAdminUser();

      if (!mounted) return;

      setUser(authState.user);
      setIsAdmin(authState.isAdmin);
      setLoading(false);
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncSession();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      throw new Error("Email ou senha inválidos.");
    }

    const authState = await getAdminUser();

    if (!authState.isAdmin || !authState.user) {
      await supabase.auth.signOut();
      throw new Error("Seu usuário não tem permissão de administrador.");
    }

    setUser(authState.user);
    setIsAdmin(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
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
