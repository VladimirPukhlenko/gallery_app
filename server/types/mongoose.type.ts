import mongoose, { Types } from 'mongoose';
import { AlbumDocument, Album } from 'src/schemas/Album.schema';

export type mongooseDoc<D, T> = mongoose.Document<
  D,
  {},
  mongoose.FlatRecord<T>
> &
  mongoose.FlatRecord<T> & {
    _id: Types.ObjectId;
  };
