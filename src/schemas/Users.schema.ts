import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from './role.enum';

@Schema({ timestamps: true })
// https://docs.nestjs.com/techniques/mongodb#model-injection
export class Users {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const usersSchema = SchemaFactory.createForClass(Users);
