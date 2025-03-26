import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Extract the base URL without the /api path
const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = VITE_API_URL.replace(/\/api$/, "");

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      console.log("Checking auth...");
      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check response:", res.data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      if (error.response?.status === 401) {
        set({ authUser: null });
      } else {
        toast.error("Failed to check authentication status");
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("Signing up...");
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("Signup response:", res.data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Logging in...");
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login response:", res.data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      // Add a small delay before connecting socket
      setTimeout(() => {
        get().connectSocket();
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Failed to log in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      console.log("Logging out...");
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Failed to log out");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log("Updating profile...");
      const res = await axiosInstance.put("/auth/update-profile", data);
      console.log("Profile update response:", res.data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    console.log("Connecting socket...");
    const socket = io(BASE_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      set({ onlineUsers: userIds });
    });

    socket.connect();
    set({ socket: socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      console.log("Disconnecting socket...");
      get().socket.disconnect();
    }
  },
}));
