"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/mousewheel";
import { Autoplay, Mousewheel } from "swiper/modules";
import Image from "next/image";

import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";
import { IImageItem } from "@/types/image.interface";
import { FetchRes } from "@/types/retch-res.interface";

type Props = {
  page: number;
  delay: number;
};
const Slider = ({ page, delay }: Props) => {
  const [images, setImages] = useState<IImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data: images } = await AxiosInstanceClient.get<
        FetchRes<IImageItem[]>
      >(`/images?limit=3&page=${page}`);
      setImages(images.data);
      setIsLoading(false);
    })();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="absolute z-10 w-full top-0 left-0 h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full relative h-full">
          <Swiper
            autoplay={{
              delay,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2000}
            loop={true}
            mousewheel={true}
            direction={"vertical"}
            modules={[Autoplay, Mousewheel]}
            className="w-full flex-1 h-full"
          >
            {images.map((image) => (
              <SwiperSlide className="relative" key={image._id}>
                <Image
                  onLoadingComplete={(image) => {
                    image.classList.remove("opacity-0");
                    setIsLoading(false);
                  }}
                  src={image.link}
                  alt="image"
                  objectFit="cover"
                  priority
                  fill
                  className="transition-opacity duration-500 opacity-0"
                  quality={30}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default Slider;
