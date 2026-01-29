import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Interest } from './interest.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  about?: string;

  @Prop()
  birthday?: Date;

  @Prop()
  height?: number;

  @Prop()
  weight?: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Interest', autopopulate: true }] })
  interests?: Interest[];

  @Prop({ default: 'light' })
  theme?: 'light' | 'dark';
}

export const UserSchema = SchemaFactory.createForClass(User);