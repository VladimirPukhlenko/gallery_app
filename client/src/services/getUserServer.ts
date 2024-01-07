import { headers } from "next/headers";
import { User as UserType } from "@/types/user.interface";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";

export const getUser = async () => {
  try {
    const { data: user } = await AxiosInstanceServer.get<UserType>("/users/me");
    return user;
  } catch (e) {
    return null;
  }
};
