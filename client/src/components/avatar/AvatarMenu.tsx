"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarComponent from "./Avatar";
import { FC } from "react";
import LogoutButton from "../auth/LogoutButton";
import LoginModal from "../auth/LoginModal";
import { useUser } from "@/providers/AuthProvider";

const AvatarMenu: FC = () => {
  const { user, setUser } = useUser();

  if (!user) {
    return <LoginModal />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer ">
        <AvatarComponent name={user?.fullName} image={user?.picture.url} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-sm w-50 text-center px-2 border dark:border-neutral-600">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="text-xs font-semibold">{user?.email}</div>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2 px-2 py-1.5">
          <div className="flex justify-between">
            Images uploaded: <span>{user?.images.length}</span>
          </div>
          <div className="flex justify-between">
            Albums created: <span>{user?.albums.length}</span>
          </div>
          <div className="flex justify-between">
            Added to favorites: <span>{user?.favorites.length}</span>
          </div>
          <DropdownMenuItem className="p-0 mb-1">
            <LogoutButton setUser={setUser} />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarMenu;
