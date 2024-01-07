import { IImageItem } from ".//image.interface";

export interface IAlbumItem {
  _id: string;
  author: string;
  name: string;
  total_images: number;
  images: IImageItem[] | string[];
  createdAt: Date;
  __v: number;
}
