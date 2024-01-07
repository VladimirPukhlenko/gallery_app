import { Metadata } from "next";
import { redirect } from "next/navigation";

import ImagesList from "@/components/image/ImagesList";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import AnimationTemplate from "@/components/animation/AnimationTemplate";
import { FetchRes } from "@/types/retch-res.interface";
import { IImageItem } from "@/types/image.interface";
import NoContent from "@/components/placeholders/NoContent";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery app | Favorites",
};
const Favorite = async () => {
  const limit = 30;
  const page = 1;
  const url = `/images/userImages/favorites?limit=${limit}&page=`;

  const { data: favorites } = await AxiosInstanceServer.get<
    FetchRes<IImageItem[]>
  >(url + page).catch((e) => redirect("/"));
  return (
    <main>
      <section className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-20 md:h-24 ">
          <h1 className="text-3xl font-bold">Favorites</h1>
          <AnimationTemplate animation="favorites" />
        </div>
        {!favorites.data?.length ? (
          <NoContent
            title="You don't have any images in your favorites. "
            subtitle="To add one, please visit the gallery page."
          />
        ) : (
          <ImagesList imagesData={favorites} url={url} />
        )}
      </section>
    </main>
  );
};

export default Favorite;
