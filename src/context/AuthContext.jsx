import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated =
    Boolean(localStorage.getItem("access_token")) && Boolean(user);

  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  const loadUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Authentication check failed:", error);

      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    setUser({
      id: response.user_id,
      name: response.name,
      email: response.email,
    });

    return response;
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (name, email, password) => {
    const response = await registerUser({
      name,
      email,
      password,
    });

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    setUser({
      id: response.user_id,
      name: response.name,
      email: response.email,
    });

    return response;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/login");
    }
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// CUSTOM HOOK
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}