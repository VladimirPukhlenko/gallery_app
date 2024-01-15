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

export interface LoginUser {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}
