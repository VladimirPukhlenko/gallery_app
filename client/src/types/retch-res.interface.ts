import { IAlbumItemWithImages } from "./album-with-images.inteface";
import { IAlbumItem } from "./album.interface";
import { IImageItem } from "./image.interface";

export interface FetchRes<
  T extends IImageItem[] | IAlbumItem[] | IAlbumItemWithImages
> {
  currentPage: string;
  totalPages: string;
  totalItems: string;
  data: T;
}
