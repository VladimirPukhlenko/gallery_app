import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { FC } from "react";
type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const TooltipLoginHelp: FC<Props> = ({ setIsOpen }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Help</Button>
      </PopoverTrigger>
      <PopoverContent className="border dark:border-neutral-600">
        <div className="text-xs flex flex-col gap-3">
          <div>
            Forget the password ?{" "}
            <Link
              href={"/recovery"}
              onClick={() => setIsOpen(false)}
              className="underline ml-auto"
            >
              Recovery
            </Link>
          </div>
          <div className="text-justify">
            Support email: <b>galleryappweb@gmail.com</b>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
