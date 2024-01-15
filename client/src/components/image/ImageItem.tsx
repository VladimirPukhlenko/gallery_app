"use client";
import { FC, useState, MouseEvent } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import ImageModal from "./ImageModal";
import FavoriteButton from "./FavoriteButton";
import ImageMenu from "./ImageMenu";
import RemoveImageButton from "./RemoveImage";
import { useAuth } from "@/providers/AuthProvider";
import { IImageItem } from "@/types/image.interface";
import { IAlbumItem } from "@/types/album.interface";

type Props = {
  imageItem: IImageItem;
  userAlbums?: IAlbumItem[];
  albumId?: string;
};
const ImageItem: FC<Props> = ({ imageItem, userAlbums, albumId }) => {
  const [isDeletedFromFavorites, setIsDeletedFromFavorites] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const isFavoritePage = pathname === "/favorites";

  return (
    <div>
      <div
        className={`relative group ${
          isFavoritePage && isDeletedFromFavorites ? "hidden" : ""
        } ${isDeleted ? "hidden" : ""}`}
      >
        <Image
          width={1000}
          height={1000}
          src={imageItem.link}
          quality={100}
          alt="image"
          className="transition-opacity duration-500 opacity-0"
          onLoad={(image) => image.currentTarget.classList.remove("opacity-0")}
        />
        {user && (
          <>
            <FavoriteButton
              setIsDeleted={setIsDeletedFromFavorites}
              imageId={imageItem._id}
            />
            <div className="absolute top-3 right-3 z-30 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center">
              <ImageMenu
                imageInfo={imageItem}
                user={user}
                userAlbums={userAlbums || []}
              />
              <RemoveImageButton
                albumId={albumId}
                setIsDeleted={setIsDeleted}
                imageId={imageItem._id}
              />
            </div>
          </>
        )}

        <ImageModal image={imageItem} />
      </div>
    </div>
  );
};

export default ImageItem;
