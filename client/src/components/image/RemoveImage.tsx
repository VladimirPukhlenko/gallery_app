import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ImageMinus, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { Dispatch, FC, SetStateAction } from "react";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { AxiosError } from "axios";
import { ErrorRes } from "@/types/error.interface";

type Props = {
  albumId?: string;
  imageId: string;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
};

const RemoveImageButton: FC<Props> = ({ albumId, imageId, setIsDeleted }) => {
  const router = useRouter();
  const pathname = usePathname();
  const cleanPathname = pathname.split("/")[1];

  if (!albumId && !["my_images", "all_albums"].includes(cleanPathname)) {
    return null;
  }

  const buttonText =
    cleanPathname === "my_images" ? "Remove Image" : "Remove from Album";

  const handleClick = async () => {
    try {
      if (buttonText === "Remove Image") {
        await AxiosInstanceClient.delete(`images/${imageId}`);
      } else if (buttonText === "Remove from Album") {
        await AxiosInstanceClient.patch(`albums/${albumId}/images/`, {
          imageId,
        });
      }
      setIsDeleted(true);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    }
  };

  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger
            className="hover:bg-black/30 p-1 rounded-md"
            onClick={handleClick}
          >
            <ImageMinus className="w-7 h-7 md:w-6 md:h-6 " />
          </TooltipTrigger>
          <TooltipContent className="border dark:border-neutral-600">
            <p className="text-xs">{buttonText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default RemoveImageButton;
