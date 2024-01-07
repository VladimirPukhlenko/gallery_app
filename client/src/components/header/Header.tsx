import LogoAnimation from "./LogoAnimation";
import AvatarMenu from "../avatar/AvatarMenu";
import ThemeToggle from "./ThemeToggle";

const Header = async () => {
  return (
    <div className="shadow-sm shadow-gray-300">
      <div className="container flex items-center justify-between h-16 z-50">
        <LogoAnimation />
        <div className="flex text-sm items-center gap-2">
          <AvatarMenu />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
