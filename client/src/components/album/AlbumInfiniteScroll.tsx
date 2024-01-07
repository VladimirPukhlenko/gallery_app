"use client";

import { FC, useState, useEffect } from "react";

import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { IAlbumItem } from "@/types/album.interface";
import { FetchRes } from "@/types/retch-res.interface";
import { useInView } from "react-intersection-observer";
import AlbumItem from "./AlbumItem";
import Loader from "../ui/Loader";

type Props = {
  url: string;
  albumsData: FetchRes<IAlbumItem[]>;
};
const AlbumInfiniteScroll: FC<Props> = ({ url, albumsData }) => {
  const { ref: loaderRef, inView } = useInView();

  const [albums, setAlbums] = useState<IAlbumItem[]>([]);
  const [page, setPage] = useState(+albumsData.currentPage + 1);
  const hasMorePages = page <= +albumsData.totalPages;
  useEffect(() => {
    (async () => {
      if (inView && hasMorePages) {
        const { data: newAlbums } = await AxiosInstanceClient.get<
          FetchRes<IAlbumItem[]>
        >(url + page);
        setPage((prev) => prev + 1);
        setAlbums((prevAlbums) => [...prevAlbums, ...newAlbums.data]);
      }
    })();
  }, [inView]);
  return (
    <>
      <>
        {albums.map((album) => (
          <AlbumItem key={album._id} album={album} />
        ))}
      </>

      {hasMorePages && (
        <div ref={loaderRef} className={`blok w-full absolute bottom-0 left-0`}>
          <Loader />
        </div>
      )}
    </>
  );
};

export default AlbumInfiniteScroll;
