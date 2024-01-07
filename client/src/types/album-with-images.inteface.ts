import { IImageItem } from "./image.interface";

export interface IAlbumItemWithImages {
  _id: string;
  author: string;
  name: string;
  images: IImageItem[];
}

// {
//     _id: '658b9cf5012f4f15d4c45935',
//     author: '658a39d239f3d9ede295bdc3',
//     name: 'first',
//     images: [
//       {
//         _id: '658a4bf5edf9e4f7f0a5c41f',
//         creator: {
//           _id: '658a39d239f3d9ede295bdc3',
//           fullName: 'Пухленко Владимир',
//           picture: {
//             url:
//               'https://res.cloudinary.com/dt18kj6yr/image/upload/v1703558314/nxhecp9yjyjteqollf13.png',
//             cloudinaryId: 'nxhecp9yjyjteqollf13',
//             _id: '658a3cabea08f214558aa64f'
//           }
//         },
