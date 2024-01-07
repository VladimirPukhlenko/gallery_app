import { Metadata } from "next";
import { redirect } from "next/navigation";

import ImagesList from "@/components/image/ImagesList";
import NoContent from "@/components/placeholders/NoContent";
import UserBadge from "@/components/uploaders/UserBadge";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import { IImageItem } from "@/types/image.interface";
import { FetchRes } from "@/types/retch-res.interface";
import { getUser } from "@/services/getUserServer";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery app | My images",
};

const MyImages = async () => {
  const limit = 30;
  const page = 1;
  const url = `/images/userImages?limit=${limit}&page=`;

  const { data: userImages } = await AxiosInstanceServer.get<
    FetchRes<IImageItem[]>
  >(url + page).catch(() => redirect("/"));
  const user = await getUser();

  return (
    <main>
      <section className="flex flex-col gap-2">
        <div className="flex justify-center items-center py-6 ">
          <UserBadge user={user!} />
        </div>
        {!userImages.data?.length ? (
          <NoContent
            title="You haven't uploaded any images."
            subtitle="To add one, please visit the gallery page and use the 'upload' button."
          />
        ) : (
          <ImagesList url={url} imagesData={userImages} />
        )}
      </section>
    </main>
  );
};

export default MyImages;
