"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, FolderPlus, Menu, Plus } from "lucide-react";
// import NewAlbumModal from "./NewAlbumModal";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import { Button } from "../ui/button";
import NewAlbumModal from "../album/NewAlbumModal";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import RemoveImageButton from "./RemoveImage";
import { IAlbumItem } from "@/types/album.interface";
import { User } from "@/types/user.interface";

type Props = {
  imageInfo: any;
  user: User;
  userAlbums: IAlbumItem[];
};

const ImageMenu: FC<Props> = ({ imageInfo, userAlbums }) => {
  const { toast } = useToast();
  const router = useRouter();

  const filteredUserAlbums = userAlbums.filter(
    (item) => !item.images.includes(imageInfo._id)
  );

  const handleClick = async (
    albumId: string,
    imageId: string,
    albumName: string
  ) => {
    await AxiosInstanceClient.patch(`/albums/${albumId}/images`, {
      imageId,
    });
    router.refresh();
    toast({
      title: "Success",
      description: `Image has been added to ${albumName} album`,
    });
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-black/30 p-1 rounded-md">
          <Menu className="w-7 h-7 md:w-6 md:h-6 " />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[35rem] overflow-y-auto border dark:border-neutral-600">
          <DropdownMenuLabel>Add to album</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className={`${userAlbums.length > 8 ? "h-48" : ""}`}>
            {filteredUserAlbums.length ? (
              filteredUserAlbums.map((album) => (
                <DropdownMenuItem
                  onClick={() =>
                    handleClick(album._id, imageInfo._id, album.name)
                  }
                  key={album._id.toString()}
                  className="flex gap-1 cursor-pointer"
                >
                  <FolderPlus size={14} />
                  {album.name}
                </DropdownMenuItem>
              ))
            ) : (
              <h3 className="px-2 py-1.5 text-sm flex justify-center items-center gap-1">
                <AlertCircle size={15} />
                Album list is empty...
              </h3>
            )}
          </ScrollArea>

          <hr className="my-2" />

          <div className="flex flex-col gap-1">
            <NewAlbumModal>
              <Button className=" flex gap-1 text-xs justify-center items-center h-8 w-full  ">
                <Plus size={14} />
                New album
              </Button>
            </NewAlbumModal>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImageMenu;
