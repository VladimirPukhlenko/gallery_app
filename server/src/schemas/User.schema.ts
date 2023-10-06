import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './Image.schema';

export type ImageDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: false, collection: 'users' })
export class User {
  _id: mongoose.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  picture: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // @Prop({ ref: 'Album', type: [mongoose.Schema.Types.ObjectId], default: [] })
  // albums: mongoose.ObjectId[];

  @Prop({ ref: 'Image', type: [mongoose.Schema.Types.ObjectId], default: [] })
  images: mongoose.ObjectId[];

  @Prop({ ref: 'Image', type: [mongoose.Schema.Types.ObjectId], default: [] })
  favorites: mongoose.ObjectId[];

  @Prop()
  refresh_token: string;

  @Prop({ immutable: true, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
