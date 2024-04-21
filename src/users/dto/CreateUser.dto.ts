import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
