"use client";
import React, { FC } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
type Props = {
  name: string;
  image: string;
};
const AvatarComponent: FC<Props> = ({ name, image }) => {
  return (
    <div className="flex gap-2 items-center ">
      <Avatar>
        <AvatarImage
          src={image || "/images/default-avatar.png"}
          className="object-cover object-center"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span className="hidden sm:inline-block">{name}</span>
    </div>
  );
};

export default AvatarComponent;
