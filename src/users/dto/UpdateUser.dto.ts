import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUsersDto } from './CreateUser.dto';
// https://docs.nestjs.com/techniques/validation#mapped-types
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUsersDto) {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
