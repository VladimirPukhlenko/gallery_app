"use client";
import React, { FormEvent, useRef, useState, MouseEvent } from "react";
import { Check, PenSquare } from "lucide-react";
import { AxiosError } from "axios";

import { Input } from "../ui/input";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { ErrorRes } from "@/types/error.interface";
import { toast } from "../ui/use-toast";

const EditAlbum = ({ title, id }: { title: string; id: string }) => {
  const [isEdit, setIsEdit] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const [albumName, setAlbumName] = useState(title);

  const handleOpen = (e: MouseEvent<HTMLDivElement>) => {
    setIsEdit(true);
    setTimeout(() => {
      if (nameInput.current) {
        nameInput?.current?.focus();
      }
    }, 0);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsEdit(false);
      if (title.trim() !== albumName.trim()) {
        await AxiosInstanceClient.patch(`/albums/${id}`, {
          newName: albumName.trim(),
        });
      }
    } catch (e) {
      const err = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: err.response?.data.message,
      });
      setAlbumName(title);
    }
  };

  return (
    <div onClick={handleOpen} className="cursor-pointer">
      {isEdit ? (
        <form className="relative w-[90%]" onSubmit={handleSubmit}>
          <Input
            ref={nameInput}
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="pr-8 text-lg"
          />
          <button className="flex absolute right-2 top-1/4" type="submit">
            <Check className="w-[1.2rem]  h-[1.2rem] " />
          </button>
        </form>
      ) : (
        <div className="flex items-baseline gap-2 group ">
          <div>{albumName}</div>
          <PenSquare className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500  " />
        </div>
      )}
    </div>
  );
};

export default EditAlbum;
