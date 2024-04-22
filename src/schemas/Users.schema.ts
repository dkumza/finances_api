import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
// https://docs.nestjs.com/techniques/mongodb#model-injection
export class Users {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop
}

export const usersSchema = SchemaFactory.createForClass(Users);
