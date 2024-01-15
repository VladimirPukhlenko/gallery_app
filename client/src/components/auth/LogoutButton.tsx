"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { User } from "@/types/user.interface";
import { clearToken } from "@/actions/cookiesManager";

type Props = {
  setUser: Dispatch<SetStateAction<User | null>>;
};
const LogoutButton: FC<Props> = ({ setUser }) => {
  const router = useRouter();
  const handleClick = async () => {
    await AxiosInstanceClient.get("auth/logout");
    setUser(null);
    await clearToken("refresh_token_client");
    await clearToken("access_token_client");
    router.replace("/");
    router.refresh();
  };
  return (
    <Button className="w-full h-7" onClick={handleClick}>
      Logout
    </Button>
  );
};

export default LogoutButton;
