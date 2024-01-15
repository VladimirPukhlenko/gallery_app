import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes, Types, model } from 'mongoose';
import { Album } from './Album.schema';
import { Image } from './Image.schema';
import { v4 as uuidv4 } from 'uuid';
export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: false, collection: 'users' })
export class User extends Document {
  @Prop()
  fullName: string;

  @Prop({
    default: { url: '', cloudinaryId: '' },
    type: {
      url: String,
      cloudinaryId: String,
    },
  })
  picture: { url: string; cloudinaryId: string };

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ ref: Album.name, type: [SchemaTypes.ObjectId], default: [] })
  albums: Types.ObjectId[];

  @Prop({ ref: Image.name, type: [SchemaTypes.ObjectId], default: [] })
  favorites: Types.ObjectId[];

  @Prop({ default: uuidv4 })
  activeRefreshTokenId: string;

  @Prop({ ref: Image.name, type: [SchemaTypes.ObjectId], default: [] })
  images: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
