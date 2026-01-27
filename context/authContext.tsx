"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { clearAuthCookies, getAuthToken, getUserData } from "../lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserData: (newData: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = await getAuthToken();
      const user = await getUserData();
      console.log("DEBUG - checkAuth loaded user:", {
        hasUser: !!user,
        profilePicture: user?.profilePicture,
        keys: user ? Object.keys(user) : [],
      });
      setUser(user);
      setIsAuthenticated(!!token);
    } catch (err) {
      console.error("DEBUG - checkAuth error:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const user = await getUserData();
      console.log("DEBUG - refreshUser loaded:", {
        profilePicture: user?.profilePicture,
        imageUrl: user?.imageUrl,
      });
      setUser(user);
      return user;
    } catch (err) {
      console.error("DEBUG - refreshUser error:", err);
      return null;
    }
  };

  const updateUserData = (newData: any) => {
    console.log("DEBUG - updateUserData called:", {
      profilePicture: newData?.profilePicture,
      imageUrl: newData?.imageUrl,
    });
    setUser(newData);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        loading,
        checkAuth,
        refreshUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
