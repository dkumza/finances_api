import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
// https://docs.nestjs.com/techniques/mongodb#model-injection
export class Users {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const usersSchema = SchemaFactory.createForClass(Users);
