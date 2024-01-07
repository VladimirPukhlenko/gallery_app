import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import Loader from "../ui/Loader";
import { SyntheticEvent, useState } from "react";
import { IImageItem } from "@/types/image.interface";
import Avatar from "../avatar/Avatar";

const ImageModal = ({ image }: { image: IImageItem }) => {
  const [isLoading, setIsLoading] = useState(true);

  const onLoadHandle = (image: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    image.currentTarget.classList.remove("opacity-0");
  };
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full absolute z-10 top-0 left-0 h-full"></DialogTrigger>
        <DialogContent className="border-none bg-transparent shadow-none max-w-6xl">
          <div className="relative h-[93vh]">
            <div className=" absolute text-xs bottom-0  -left-48  backdrop-blur-md bg-white/40 px-4 py-2 rounded-lg hidden xl:block">
              <Avatar
                name={image.creator.fullName}
                image={image.creator.picture.url}
              />
            </div>
            <Image
              src={image.link}
              alt={"image"}
              onLoad={(image) => onLoadHandle(image)}
              fill
              objectFit="contain"
              quality={100}
              className="transition-opacity duration-500 opacity-0 "
            />
            {isLoading && (
              <div className="absolute w-16 bottom-1/2 left-1/2 translate-x-[-50%] translate-y-[50%]">
                <Loader />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageModal;
