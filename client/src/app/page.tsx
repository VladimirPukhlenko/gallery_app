import { redirect } from "next/navigation";

import UploadButton from "@/components/uploaders/UploadButton";
import ImagesList from "@/components/image/ImagesList";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import { FetchRes } from "@/types/retch-res.interface";
import { IImageItem } from "@/types/image.interface";

export const dynamic = "force-dynamic";

const Gallery = async () => {
  const limit = 20;
  const page = 1;
  const url = `/images?limit=${limit}&page=`;

  const { data: images } = await AxiosInstanceServer.get<
    FetchRes<IImageItem[]>
  >(url + page).catch(() => redirect("/"));

  return (
    <main>
      <section className="flex flex-col gap-2 ">
        <div className="flex justify-between items-center h-20 md:h-24">
          <h1 className="text-3xl font-bold ">Gallery</h1>
          <UploadButton />
        </div>

        <ImagesList imagesData={images} url={url} />
      </section>
    </main>
  );
};

export default Gallery;
