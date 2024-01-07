import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../User.schema';
import { AlbumDocument, Album } from '../Album.schema';
import { mongooseDoc } from 'types/mongoose.type';

export async function handleAlbumDelete(
  doc: mongooseDoc<AlbumDocument, Album>,
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  const UserModel = doc.model<Model<UserDocument>>(User.name);
  const user = await UserModel.findById(doc.author);
  user.albums = user?.albums.filter(
    (item) => item.toString() !== doc._id.toString(),
  );
  await user?.save();
  next();
}

export async function handleAlbumSave(
  doc: mongooseDoc<AlbumDocument, Album>,
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  const UserModel = doc.model<Model<UserDocument>>(User.name);
  const user = await UserModel.findById(doc.author);
  if (!user.albums.includes(doc._id)) user?.albums.push(doc._id);
  await user?.save();
  next();
}
