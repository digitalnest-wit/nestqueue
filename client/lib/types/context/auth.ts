"use client";

import { createContext, useContext } from "react";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });
export default AuthContext;