"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { FC } from "react";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useToast } from "../ui/use-toast";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { ErrorRes } from "@/types/error.interface";

type Props = {
  id: string;
  title: string;
};
const RemoveAlbum: FC<Props> = ({ id, title }) => {
  const router = useRouter();
  const { toast } = useToast();
  const deleteAlbum = async () => {
    try {
      await AxiosInstanceClient.delete(`albums/${id}`);
      toast({
        title: "Success",
        description: `Album "${title}" has been successfully deleted`,
      });

      router.refresh();
    } catch (e) {
      const err = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: err.response?.data.message,
      });
    }
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={deleteAlbum}
            className="cursor-pointer hover:text-red-400 transition-colors duration-200 "
          >
            <Trash className="w-[1.2rem] h-[1.2rem] " />
          </span>
        </TooltipTrigger>
        <TooltipContent className="border dark:border-neutral-600">
          <p className="text-xs">Delete the album</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RemoveAlbum;
