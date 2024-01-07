"use client";
import React, { FC, FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { IAlbumItem } from "@/types/album.interface";
import { ErrorRes } from "@/types/error.interface";

type Props = {
  children: React.ReactNode;
};
const NewAlbumModal: FC<Props> = ({ children }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const submitHandler = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const { data: album } = await AxiosInstanceClient.post<IAlbumItem>(
        "/albums",
        {
          name: value,
        }
      );
      router.refresh();
      toast({
        title: "Success",
        description: `Album ${album.name} has been successfully created`,
      });
      setValue("");
      setIsOpen(false);
    } catch (e) {
      const err = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: err.response?.data.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-8 max-w-xl border dark:border-neutral-600">
        <form
          onSubmit={(e) => submitHandler(e)}
          className="flex flex-col gap-4"
        >
          <DialogTitle>Create new album</DialogTitle>
          Come up with a suitable name for your album, after creation, you can
          find it on the albums page or all albums page.
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Album name..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Button
              type="submit"
              className="w-1/4 mx-auto"
              disabled={!value.length}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAlbumModal;
