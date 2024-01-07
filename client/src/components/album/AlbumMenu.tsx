"use client";

import React, { FC, useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "../ui/button";
import MobileAlbumMenu from "./MobileAlbumMenu";
import { usePathname } from "next/navigation";
import { IAlbumItem } from "@/types/album.interface";

type Props = {
  allAlbums: IAlbumItem[];
};

const AlbumMenu: FC<Props> = ({ allAlbums }) => {
  const partOfAlbums = allAlbums.slice(0, 8);
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const defaultValue = partOfAlbums.find((item) => item._id === id);

  return (
    <menu className="flex justify-between items-center py-1">
      <div className=" hidden md:block">
        {allAlbums.length ? (
          <Tabs
            defaultValue={(defaultValue || partOfAlbums[0]).name.toLowerCase()}
          >
            <TabsList className="flex flex-wrap justify-start gap-3">
              {partOfAlbums.map((album) => (
                <Link href={`/albums/${album._id}`} key={album._id}>
                  <TabsTrigger value={album.name.toLowerCase()}>
                    {album.name}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          ""
        )}
      </div>
      <div className="md:hidden w-2/3">
        <MobileAlbumMenu allAlbums={allAlbums} />
      </div>
      <Link href={"/all_albums"}>
        <Button>All albums</Button>
      </Link>
    </menu>
  );
};

export default AlbumMenu;
