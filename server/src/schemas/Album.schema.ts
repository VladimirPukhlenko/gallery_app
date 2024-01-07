import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types, Document, Model } from 'mongoose';

import {
  handleAlbumDelete,
  handleAlbumSave,
} from './middlewares/albums.middleware';

export type AlbumDocument = mongoose.HydratedDocument<Album>;

@Schema({ timestamps: false, collection: 'albums', toJSON: { virtuals: true } })
export class Album extends Document {
  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  author: Types.ObjectId;

  @Prop()
  name: string;
  @Prop({ ref: 'Image', type: [SchemaTypes.ObjectId], default: [] })
  images: Types.ObjectId[];

  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

AlbumSchema.post('save', handleAlbumSave);

AlbumSchema.post(
  'deleteOne',
  { document: true, query: false },
  handleAlbumDelete,
);

AlbumSchema.virtual<AlbumDocument>('total_images').get(function () {
  return this.depopulate().images.length;
});
