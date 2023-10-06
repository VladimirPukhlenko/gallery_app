import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.schema';

export type ImageDocument = mongoose.HydratedDocument<Image>;
@Schema({ timestamps: false, collection: 'images' })
export class Image {
  _id: mongoose.ObjectId;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  creator: mongoose.ObjectId;
  @Prop()
  link: string;
  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
