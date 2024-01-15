import { useRouter } from "next/navigation";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";

import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { User } from "@/types/user.interface";
import { useAuth } from "@/providers/AuthProvider";
type Props = {
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  imageId: string;
};

const FavoriteButton: FC<Props> = ({ setIsDeleted, imageId }) => {
  const { user, setUser } = useAuth();
  const isUserLiked = user?.favorites.includes(imageId);
  const [isFavorite, setisFavorite] = useState(isUserLiked);
  const router = useRouter();

  const toggleFavorite = async () => {
    try {
      const updatedFavorites = isFavorite
        ? user!.favorites.filter((item) => item !== imageId)
        : [...user!.favorites, imageId];

      setUser((prev) => ({ ...prev!, favorites: updatedFavorites }));
      setIsDeleted(true);
      setisFavorite((prev) => !prev);

      await AxiosInstanceClient.patch(`/images/${imageId}/favorites`);
      router.refresh();
    } catch (e) {
      setisFavorite((prev) => !prev);
    }
  };

  return (
    <span
      className="cursor-pointer absolute z-20 top-3 left-3 hover:text-red-400 transition-colors duration-200 
"
      onClick={toggleFavorite}
    >
      {isFavorite ? (
        <LiaHeartSolid className="text-red-500 w-7 h-7 " />
      ) : (
        <LiaHeart className="w-7 h-7" />
      )}
    </span>
  );
};

export default FavoriteButton;
