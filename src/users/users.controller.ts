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
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUsers(
    @Body(new ValidationPipe({ whitelist: true }))
    createUserDto: CreateUsersDto,
  ) {
    return this.userService.createUser(createUserDto);
  }

  // GET return a user by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(['admin', 'staff', 'user'])
  async getUser(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string; role: string } },
  ) {
    const { id: tokenUserId } = req.user;
    const role = req.user.role;

    if (tokenUserId === id || role === 'admin') {
      const found = await this.userService.getUserById(id);
      if (!found) throw new HttpException('User not found', 404);

      const { password, ...result } = found.toObject(); // exl psw and convert to obj
      return result;
    }

    throw new HttpException('Unauthorized', 401);
  }

  // GET return all users - only for admin and staff roles
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(['admin'])
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(['admin', 'user'])
  async updateUser(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string; role: string } },
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateUserDto,
  ) {
    const { id: tokenUsernameId } = req.user;
    const role = req.user.role;

    if (tokenUsernameId === id || role === 'admin') {
      return role === 'admin'
        ? await this.userService.updateByAdmin(id, updateUserDto)
        : await this.userService.updateUser(id, updateUserDto);
    }

    throw new HttpException('User not found', 404);
  }
}
