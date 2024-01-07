"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { User } from "@/types/user.interface";

type Props = {
  setUser: Dispatch<SetStateAction<User | null>>;
};
const LogoutButton: FC<Props> = ({ setUser }) => {
  const router = useRouter();
  const handleClick = async () => {
    await AxiosInstanceClient.get("auth/logout");
    setUser(null);
    router.refresh();
    router.replace("/");
  };
  return (
    <Button className="w-full h-7" onClick={handleClick}>
      Logout
    </Button>
  );
};

export default LogoutButton;
