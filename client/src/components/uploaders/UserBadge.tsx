"use client";

import { FC } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { CldUploadButton } from "next-cloudinary";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";
import { CloudinaryUploadResult } from "@/types/cloudinaryUploadResult.interface";
import { ErrorRes } from "@/types/error.interface";
import { User } from "@/types/user.interface";

type Props = {
  user: User;
};

const UserBadge: FC<Props> = ({ user }) => {
  const { setUser } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const changePicture = async (results: CloudinaryUploadResult) => {
    const { secure_url: url, public_id: cloudinaryId } = results.info;
    try {
      await AxiosInstanceClient.patch("users/edit", {
        picture: {
          url,
          cloudinaryId,
        },
      });
      setUser((prev) => ({
        ...prev!,
        picture: {
          url,
          cloudinaryId,
        },
      }));
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }
  };

  return (
    <div className=" flex flex-col sm:flex-row gap-6 md:gap-12 text-base w-full justify-center  items-center md:items-start">
      <div className="relative w-56 md:w-48 aspect-square  rounded-full overflow-hidden border dark:border-neutral-600">
        <CldUploadButton
          uploadPreset={process.env.CLOUDINARY_UPLOADPRESET}
          onUpload={(results) =>
            changePicture(results as CloudinaryUploadResult)
          }
        >
          <Image
            src={user.picture.url || "/images/default-avatar.png"}
            alt="avatar"
            objectFit="cover"
            fill
            priority
            quality={50}
            className="hover:opacity-80 transition-opacity duration-300"
          />
        </CldUploadButton>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg">{user.fullName}</h1>
          <Button className=" py-2  h-8" asChild>
            <CldUploadButton
              uploadPreset={process.env.CLOUDINARY_UPLOADPRESET}
              className="flex gap-2"
              onUpload={(results) =>
                changePicture(results as CloudinaryUploadResult)
              }
            >
              Change photo
            </CldUploadButton>
          </Button>
        </div>

        <div className="flex gap-4">
          <div>{user.images.length} images</div>
          <Link href={"/albums"}>{user.albums.length} albums</Link>
          <Link href={"/favorites"}>{user.favorites.length} favorites</Link>
        </div>
      </div>
    </div>
  );
};

export default UserBadge;
