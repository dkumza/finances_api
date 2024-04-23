import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/Users.schema';
import { CreateUsersDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from 'src/utils/pswUtils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}

  async createUser(createUserDto: CreateUsersDto) {
    const existingEmail = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // generate random username
    const randomUsername = uuidv4();
    console.log('randomUsername: ', randomUsername);

    // hash password
    const hashPsw = await hashPassword(createUserDto.password);

    const newUser = new this.usersModel({
      ...createUserDto,
      username: randomUsername,
      password: hashPsw,
    });
    return await newUser.save();
  }

  async getUserByEmail(email: string) {
    return await this.usersModel.findOne({ email: email }).exec();
  }

  async getUserById(id: string) {
    return await this.usersModel.findById(id);
  }

  async getAllUsers() {
    return await this.usersModel.find().select('-password').exec();
  }

  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { username, email, password } = updateUserDto;
    const updateFields = { username, email, password };
    return await this.usersModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
  }

  async updateByAdmin(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }
}
