"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "@/lib/axios";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  mutate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { publicKey, connect, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setVisible } = useWalletModal();

  const checkAuthStatus = async () => {
    if (publicKey) {
      const {
        data: {
          user: { walletAddress },
        },
      } = await api.get<{ user: { walletAddress: string } }>("/v1/me");
      if (walletAddress === publicKey.toString()) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        throw "In valid";
      }
    }
  };

  const mutate = async () => {
    await checkAuthStatus();
  };

  const login = async () => {
    try {
      setIsLoading(true);
      await connect();
      checkAuthStatus();
    } catch (error) {
      console.log("🚀 ~ login ~ error:", error);
      setVisible(true);
      setIsLoading(false);
    }
  };

  const logout = () => {
    disconnect();
    setIsAuthenticated(false);
  };

  React.useEffect(() => {
    login();
  }, [publicKey]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading, mutate }}
    >
      {children}
    </AuthContext.Provider>
  );
};
