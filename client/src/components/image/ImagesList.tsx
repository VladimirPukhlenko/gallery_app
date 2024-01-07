import { FC } from "react";

import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import InfiniteScroll from "./ImageInfiniteScroll";
import ImageItem from "./ImageItem";
import { IImageItem } from "@/types/image.interface";
import { FetchRes } from "@/types/retch-res.interface";
import { IAlbumItem } from "@/types/album.interface";

const loadAlbums = async () => {
  try {
    const { data: albumsData } = await AxiosInstanceServer.get<
      FetchRes<IAlbumItem[]>
    >("/albums?page=1&limit=500");
    return albumsData;
  } catch (err) {
    return { data: [] };
  }
};

type Props = {
  imagesData: FetchRes<IImageItem[]>;
  url: string;
  albumId?: string;
};
const ImagesList: FC<Props> = async ({ url, imagesData, albumId }) => {
  const albums = await loadAlbums();
  return (
    <div>
      <div className="relative columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-x-2 [&>*]:mb-2 pb-20">
        {imagesData.data.map((image) => (
          <ImageItem
            key={image._id}
            imageItem={image}
            albumId={albumId}
            userAlbums={albums.data}
          />
        ))}
        <InfiniteScroll
          url={url}
          imageData={imagesData}
          userAlbums={albums.data}
          albumId={albumId}
        />
      </div>
    </div>
  );
};

export default ImagesList;
