import { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from "../services/auth";
import Router from "next/router";

import { setCookie, parseCookies } from "nookies";
import { api } from "../services/api";

interface SignInData {
  email: string;
  password: string;
}

type User = {
  name: string;
  email: string;
  avatar_url: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  sigIn: ({ email, password }: SignInData) => Promise<void>;
  user: User;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      recoverUserInformation().then((response) => setUser(response.user));
    }
  }, []);

  async function sigIn({ email, password }: SignInData) {
    const { user, token } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    setUser(user);
    Router.push("/dashboard");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        sigIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
