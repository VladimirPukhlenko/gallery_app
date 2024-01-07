"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { FC, use } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useUser } from "@/providers/AuthProvider";

type Props = {
  href: string;
  title: string;
  icon: JSX.Element;
};

const MenuButtons: FC<Props> = ({ href, title, icon }) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { user } = useUser();

  const clickHandle = () => {
    if (!user && href !== "/") {
      toast({
        title: "Warning",
        description: "To have access to this page please log in",
        duration: 1500,
      });
    }
  };

  return (
    <Link key={href} href={href} className="w-full">
      <Button
        variant={
          pathname.split("/")[1] === href.split("/")[1] ? "secondary" : "ghost"
        }
        onClick={clickHandle}
        className="flex w-full gap-1 justify-start"
      >
        {icon}
        <div className="hidden w-20 sm:block">{title}</div>
      </Button>
    </Link>
  );
};

export default MenuButtons;
