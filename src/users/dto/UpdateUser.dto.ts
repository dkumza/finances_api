import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUsersDto } from './CreateUser.dto';
// https://docs.nestjs.com/techniques/validation#mapped-types
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUsersDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  role: string;
}
