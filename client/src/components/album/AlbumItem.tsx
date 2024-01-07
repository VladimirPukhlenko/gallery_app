"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditAlbum from "./EditAlbum";
import RemoveAlbum from "./RemoveAlbum";
import { IAlbumItem } from "@/types/album.interface";

type Props = {
  album: IAlbumItem;
};
const AlbumItem: FC<Props> = ({ album }) => {
  return (
    <Card className="hover:shadow-md w-full mb-2 inline-block relative transition-shadow duration-200 dark:border-neutral-600">
      <CardHeader className="relative">
        <CardTitle className=" flex flex-row justify-between items-center">
          <EditAlbum title={album.name} id={album._id} key={album._id} />
          <span className="text-lg">{album.total_images}</span>
        </CardTitle>
      </CardHeader>
      <Link href={`/all_albums/${album._id}`}>
        <CardContent className="columns-3  gap-x-2 [&>*]:mb-2">
          {album.images.length &&
            album.images.map((image: any) => (
              <Image
                key={image._id}
                width={100}
                height={100}
                className="filter grayscale w-full"
                alt="image"
                src={image.link}
              />
            ))}
        </CardContent>
      </Link>
      <CardFooter className="flex justify-end px-5">
        <RemoveAlbum id={album._id} title={album.name} />
      </CardFooter>
    </Card>
  );
};

export default AlbumItem;
