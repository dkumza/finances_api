import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpensesDocument = Expenses & Document;

@Schema({ timestamps: true })
export class Expenses {
  // createdBy is a reference to the User schema
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
