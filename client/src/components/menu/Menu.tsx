import React from "react";
import { Image, FolderOpen, Heart, FileImage } from "lucide-react";
import MenuButtons from "./MenuButtons";

const Menu = () => {
  const buttons = [
    { href: "/", title: "Gallery", icon: <Image /> },
    {
      href: `/albums/last`,
      title: "Albums",
      icon: <FolderOpen />,
    },
    {
      href: "/favorites",
      title: "Favorites",
      icon: <Heart />,
    },
    {
      href: "/my_images",
      title: "My images",
      icon: <FileImage />,
    },
  ];
  return (
    <aside className="fixed z-50 bottom-4 w-full left-0 flex justify-center lg:py-4 lg:static lg:w-1/4">
      <div className="mx-auto rounded-sm lg:w-full">
        <h2 className="hidden lg:block mb-2 px-4 text-lg font-semibold tracking-tight">
          Menu
        </h2>
        <div className="bg-background rounded-md flex gap-2 items-start lg:flex-col lg:w-full">
          {buttons.map((button) => (
            <MenuButtons key={button.href} {...button} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Menu;
