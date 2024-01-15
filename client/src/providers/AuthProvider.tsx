"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { User as UserType } from "../types/user.interface";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
type ContextData = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
};
const UserContext = createContext<ContextData>({} as ContextData);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | UserType>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: user } = await AxiosInstanceClient.get<UserType>(
          "users/me"
        );
        setUser(user);
      } catch (e) {
        setUser(null);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
