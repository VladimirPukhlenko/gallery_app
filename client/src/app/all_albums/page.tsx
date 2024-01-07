import React from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Metadata } from "next";

import NewAlbumModal from "@/components/album/NewAlbumModal";
import AlbumItem from "@/components/album/AlbumItem";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import AnimationTemplate from "@/components/animation/AnimationTemplate";
import { FetchRes } from "@/types/retch-res.interface";
import { IAlbumItem } from "@/types/album.interface";
import NoContent from "@/components/placeholders/NoContent";
import AlbumInfiniteScroll from "@/components/album/AlbumInfiniteScroll";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery app | All albums",
};

const allAlbums = async () => {
  const url = "/albums?populate=true&populateLimit=8&limit=5&page=";
  const { data: albums } = await AxiosInstanceServer.get<
    FetchRes<IAlbumItem[]>
  >(url).catch(() => redirect("/"));
  return (
    <main>
      <section className="flex flex-col">
        <div className="flex justify-between items-center h-20 md:h-24 ">
          <h1 className="text-3xl font-bold flex gap-2 items-center">
            All albums{" "}
            <NewAlbumModal>
              <Plus size={24} className="cursor-pointer " />
            </NewAlbumModal>
          </h1>

          <AnimationTemplate animation="allAlbums" />
        </div>

        {albums?.data?.length ? (
          <div className=" relative   columns-1 sm:columns-2 md:columns-3  gap-x-2 gap-y-2 pb-20">
            {albums.data.map((album) => (
              <AlbumItem key={album._id} album={album} />
            ))}

            <AlbumInfiniteScroll albumsData={albums} url={url} />
          </div>
        ) : (
          <NoContent
            title="You don't have any albums yet."
            subtitle="To create one, please click on the plus sign or navigate to the gallery page."
          />
        )}
      </section>
    </main>
  );
};

export default allAlbums;
