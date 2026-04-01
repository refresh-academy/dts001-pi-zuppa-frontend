import { createContext, useContext, useState, ReactNode } from "react";
import type { user, PuntoDiDistribuzione } from "../types/piuzuppa";

interface AuthContextType {
  user: user | null;
  currentSite: PuntoDiDistribuzione | null;
  login: (userData: user) => void;
  logout: () => void;
  updateSite: (site: PuntoDiDistribuzione) => void;
  syncUser: (updatedUser: user) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(() => {
    const saved = localStorage.getItem("activeUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentSite, setCurrentSite] = useState<PuntoDiDistribuzione | null>(() => {
    const saved = localStorage.getItem("currentSite");
    return (saved as PuntoDiDistribuzione) || null;
  });

  const login = (userData: user) => {
    setUser(userData);
    const defaultSite = userData.puntiDistribuzione[0];
    setCurrentSite(defaultSite);
    localStorage.setItem("activeUser", JSON.stringify(userData));
    localStorage.setItem("currentSite", defaultSite);
  };

  const logout = () => {
    setUser(null);
    setCurrentSite(null);
    localStorage.clear();
  };

  const updateSite = (site: PuntoDiDistribuzione) => {
    setCurrentSite(site);
    localStorage.setItem("currentSite", site);
  };

  const syncUser = (updatedUser: user) => {
    setUser((currentUser) => {
      if (!currentUser || currentUser.id !== updatedUser.id) {
        return currentUser;
      }

      localStorage.setItem("activeUser", JSON.stringify(updatedUser));

      const nextSite = updatedUser.puntiDistribuzione.includes(currentSite as PuntoDiDistribuzione)
        ? currentSite
        : updatedUser.puntiDistribuzione[0] ?? null;

      setCurrentSite(nextSite);

      if (nextSite) {
        localStorage.setItem("currentSite", nextSite);
      } else {
        localStorage.removeItem("currentSite");
      }

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, currentSite, login, logout, updateSite, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
