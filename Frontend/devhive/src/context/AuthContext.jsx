import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data?.data?.user;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(response.data?.message || "Logged in successfully!");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check credentials.";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      const userData = response.data?.data?.user;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(response.data?.message || "Registration successful!");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request warning:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
