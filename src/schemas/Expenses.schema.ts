import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './exoebses.enum';

export type ExpensesDocument = Expenses & Document;

@Schema({ timestamps: true })
export class Expenses {
  // createdBy is a reference to the User schema
  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(Category),
  })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
