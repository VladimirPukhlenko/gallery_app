import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.schema';
import { Image } from './Image.schema';

export type AlbumDocument = mongoose.HydratedDocument<Album>;
@Schema({ timestamps: false, collection: 'albums' })
export class Album {
  _id: mongoose.ObjectId;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  author: mongoose.ObjectId;

  @Prop()
  name: string;

  @Prop({ ref: 'Image', type: [mongoose.Schema.Types.ObjectId], default: [] })
  images: mongoose.ObjectId[];

  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
