import React from "react";

import ImagesList from "@/components/image/ImagesList";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import { redirect } from "next/navigation";
import { IAlbumItem } from "@/types/album.interface";
import { FetchRes } from "@/types/retch-res.interface";
import { IImageItem } from "@/types/image.interface";
import { getFormattedDate } from "@/utils/getFormattedDate";
import NoContent from "@/components/placeholders/NoContent";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: albumInfo } = await AxiosInstanceServer.get<IAlbumItem>(
    `/albums/${params.id}`
  );
  return {
    title: `Gallery app | ${albumInfo.name}`,
  };
}

const SingleAlbum = async ({ params }: { params: { id: string } }) => {
  const { data: albumInfo } = await AxiosInstanceServer.get<IAlbumItem>(
    `/albums/${params.id}`
  ).catch(() => redirect("/"));

  const limit = 8;
  const page = 1;
  const url = `/images/userImages?album=${params.id}&limit=${limit}&page=`;
  const { data: albumData } = await AxiosInstanceServer.get<
    FetchRes<IImageItem[]>
  >(url + page).catch(() => redirect("/"));

  return (
    <main>
      <section className="flex flex-col">
        <div className="flex  gap-4 justify-between items-center h-20 md:h-24 ">
          <h1 className="text-3xl font-bold">{albumInfo.name}</h1>

          <div className="flex flex-col p px-5 border-l">
            <h1 className="text-base font-bold">
              Images: {albumInfo.total_images}
            </h1>
            <h1 className=" hidden sm:inline-block text-base font-bold">
              Created: {getFormattedDate(albumInfo.createdAt)}
            </h1>
          </div>
        </div>
        {!albumData.data?.length ? (
          <NoContent
            title="You don't have any images in this album."
            subtitle="To add one, please visit the gallery page."
          />
        ) : (
          <ImagesList imagesData={albumData} url={url} albumId={params.id} />
        )}
      </section>
    </main>
  );
};

export default SingleAlbum;
