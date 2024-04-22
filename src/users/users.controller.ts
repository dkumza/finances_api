import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/CreateUser.dto';
import { hashPassword } from 'src/utils/pswUtils';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUsers(@Body(ValidationPipe) createUserDto: CreateUsersDto) {
    const hashPsw = await hashPassword(createUserDto.password);
    const user = { ...createUserDto, password: hashPsw };
    console.log('createUserDto: ', createUserDto);
    await this.userService.createUser(user);
  }

  @Get(':username')
  async getUser(
    @Param('username') username: string,
    @Req() req: Request & { user: { username: string } },
  ) {
    // check if username is the same as the one in the token
    const { username: tokenUsername } = req.user;
    if (tokenUsername !== username) {
      throw new HttpException('Unauthorized', 401);
    }

    const found = await this.userService.getUserByUsername(username);
    // console.log('found: ', found);
    if (!found) throw new HttpException('User not found', 404);

    const { password, ...result } = found.toObject(); // exl psw and convert to obj
    return result;
  }

  @Get()
  @Roles(['admin'])
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    const found = await this.userService.updateUser(id, updateUserDto);
    if (!found) throw new HttpException('User not found', 404);
    return found;
  }
}

// @Get(':id')
// async getUserById(@Param('id') id: string) {
//   const found = await this.userService.getUserById(id);
//   if (!found) throw new HttpException('User not found', 404);
//   return found;
// }
