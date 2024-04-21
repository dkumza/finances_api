import { CreateUsersDto } from './CreateUser.dto';
// https://docs.nestjs.com/techniques/validation#mapped-types
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUsersDto) {}
