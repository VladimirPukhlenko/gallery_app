import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types, Document } from 'mongoose';

import {
  handleImageDelete,
  handleImageSave,
} from './middlewares/image.middlware';

export type ImageDocument = mongoose.HydratedDocument<Image>;
@Schema({ timestamps: false, collection: 'images' })
export class Image extends Document {
  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  creator: Types.ObjectId;

  @Prop()
  link: string;

  @Prop({ immutable: true })
  cloudinaryId: string;

  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.post('save', handleImageSave);

ImageSchema.post(
  'deleteOne',
  { document: true, query: false },
  handleImageDelete,
);
