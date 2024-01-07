import React from "react";
import { redirect } from "next/navigation";

import ImagesList from "@/components/image/ImagesList";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import { FetchRes } from "@/types/retch-res.interface";
import { IImageItem } from "@/types/image.interface";
import { IAlbumItem } from "@/types/album.interface";
import NoContent from "@/components/placeholders/NoContent";

const Album = async ({ params }: { params: { id: string } }) => {
  if (params.id === "last") {
    const { data: albums } = await AxiosInstanceServer.get<
      FetchRes<IAlbumItem[]>
    >("/albums?limit=1").catch(() => redirect("/"));
    params.id = albums.data.at(-1)?._id || "empty";
  }

  if (params.id === "empty") {
    return (
      <NoContent
        title="You don't have any albums yet."
        subtitle="To create one, please click on the plus sign or navigate to the gallery page."
      />
    );
  }

  const limit = 30;
  const page = 1;
  const url = `/images/userImages?album=${params.id}&limit=${limit}&page=`;
  const { data: images } = await AxiosInstanceServer.get<
    FetchRes<IImageItem[]>
  >(url + page).catch(() => redirect("/"));

  return (
    <>
      {!images.data?.length ? (
        <NoContent
          title="You don't have any images in this album. "
          subtitle="To add one, please visit the gallery page."
        />
      ) : (
        <ImagesList imagesData={images} url={url} albumId={params.id} />
      )}
    </>
  );
};

export default Album;
