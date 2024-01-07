import { User } from "./user.interface";

export interface IImageItem {
  _id: string;
  creator: Pick<User, "fullName" | "picture" | "_id">;
  cloudinaryId: string;
  link: string;
  createdAt: string;
  __v: number;
}
