import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { hashPassword } from 'src/utils/pswUtils';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUsers(@Body(ValidationPipe) createUserDto: CreateUsersDto) {
    const hashPsw = await hashPassword(createUserDto.password);
    const user = { ...createUserDto, password: hashPsw };
    console.log('createUserDto: ', createUserDto);
    await this.userService.createUser(user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    // Check if the id is a valid mongoose id, recommended to do that in mw
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new HttpException('User not found', 400);

    const found = this.userService.getUserById(id);
    if (!found) throw new HttpException('User not found', 404);
    return found;
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    // Check if the id is a valid mongoose id, recommended to do that in mw
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new HttpException('User not found', 400);

    const updated = await this.userService.updateUser(id, updateUserDto);
    console.log('updated: ', updated);
    if (!updated) throw new HttpException('User not found', 404);
    return updated;
  }
}
