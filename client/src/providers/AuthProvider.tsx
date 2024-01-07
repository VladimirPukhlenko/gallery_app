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
import { useRouter } from "next/navigation";
import { User as UserType } from "../types/user.interface";
type ContextData = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
};
const UserContext = createContext<ContextData>({} as ContextData);

export function AuthProvider({ children }: any) {
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

export function useUser() {
  return useContext(UserContext);
}
