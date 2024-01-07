import mongoose, { Model, Types } from 'mongoose';
import { mongooseDoc } from 'types/mongoose.type';
import { Album, AlbumDocument } from '../Album.schema';
import { ImageDocument } from '../Image.schema';
import { User, UserDocument } from '../User.schema';
import { Image } from '../Image.schema';

export async function handleImageDelete(
  doc: mongooseDoc<ImageDocument, Image>,
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  const UserModel = doc.model<Model<UserDocument>>(User.name);
  const AlbumModel = doc.model<Model<AlbumDocument>>(Album.name);
  await UserModel.updateMany(
    { favorites: doc._id },
    { $pull: { favorites: doc._id } },
  );
  await UserModel.updateMany(
    { images: doc._id },
    { $pull: { images: doc._id } },
  );
  await AlbumModel.updateMany(
    { images: doc._id },
    { $pull: { images: doc._id } },
  );
  next();
}

export async function handleImageSave(
  doc: mongooseDoc<ImageDocument, Image>,
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  const UserModel = doc.model<Model<UserDocument>>(User.name);
  const user = await UserModel.findById(doc.creator);
  user?.images.push(new Types.ObjectId(doc._id));
  await user?.save();
  next();
}
