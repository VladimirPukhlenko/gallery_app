export interface User {
  createdAt: Date;
  email: string;
  favorites: string[];
  fullName: string;
  images: string[];
  albums: string[];
  picture: {
    url: string;
    cloudinaryId: string;
    _id?: string;
  };
  __v: number;
  _id: string;
}
