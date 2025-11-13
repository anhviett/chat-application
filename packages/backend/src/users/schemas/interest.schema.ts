import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Interest {
  @Prop({ required: true })
  name: string;
}

export type InterestDocument = Interest & Document;
export const InterestSchema = SchemaFactory.createForClass(Interest);
