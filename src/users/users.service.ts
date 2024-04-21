import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/Users.schema';
import { CreateUsersDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}

  createUser(createUserDto: CreateUsersDto) {
    const newUser = new this.usersModel(createUserDto);
    return newUser.save();
  }

  getUserById(id: string) {
    return this.usersModel.findById(id).exec();
  }

  getAllUsers() {
    return this.usersModel.find();
  }

  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
}
