import React from "react";
import { Plus } from "lucide-react";

import AlbumMenu from "@/components/album/AlbumMenu";
import AnimationTemplate from "@/components/animation/AnimationTemplate";
import NewAlbumModal from "@/components/album/NewAlbumModal";
import { AxiosInstanceServer } from "@/lib/axiosConfigServer";
import { FetchRes } from "@/types/retch-res.interface";
import { IAlbumItem } from "@/types/album.interface";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { data: albums } = await AxiosInstanceServer.get<
    FetchRes<IAlbumItem[]>
  >("/albums?page=1&limit=50");
  return (
    <main>
      <section className="flex flex-col gap-2">
        <div className="flex flex-col ">
          <div className="flex justify-between items-center h-20 md:h-24">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Albums{" "}
              <NewAlbumModal>
                <Plus size={24} className="cursor-pointer " />
              </NewAlbumModal>
            </h1>
            <AnimationTemplate animation="albums" />
          </div>
          <AlbumMenu allAlbums={albums.data} />
        </div>
        {children}
      </section>
    </main>
  );
};

export default layout;
