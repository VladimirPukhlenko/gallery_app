"use client";
import { FC, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import Loader from "../ui/Loader";
import ImageItem from "./ImageItem";
import { IAlbumItem } from "@/types/album.interface";
import { IImageItem } from "@/types/image.interface";
import { FetchRes } from "@/types/retch-res.interface";

type Props = {
  url: string;
  imageData: FetchRes<IImageItem[]>;
  userAlbums: IAlbumItem[];
  albumId?: string;
};
const InfiniteScroll: FC<Props> = ({ url, imageData, userAlbums, albumId }) => {
  const [images, setImages] = useState<IImageItem[]>([]);
  const [page, setPage] = useState(+imageData.currentPage + 1);
  const { ref, inView } = useInView();
  const hasMorePages = page <= +imageData.totalPages;
  useEffect(() => {
    if (inView && hasMorePages) {
      (async () => {
        const { data: imagesData } = await AxiosInstanceClient.get<
          FetchRes<IImageItem[]>
        >(url + page);
        setPage((prev) => prev + 1);
        setImages((prevImages) => [...prevImages, ...imagesData.data]);
      })();
    }
  }, [inView]);
  return (
    <>
      <>
        {images.map((image) => (
          <ImageItem
            key={image._id}
            imageItem={image}
            userAlbums={userAlbums}
            albumId={albumId}
          />
        ))}
      </>
      {hasMorePages && (
        <div ref={ref} className={`blok w-full absolute bottom-0 left-0`}>
          <Loader />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
