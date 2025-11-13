import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PasswordHashHelper from '../common/helpers/password-hash.helper';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto) {
    // dto should contain at least { email, password, ... }
    const hashed = await PasswordHashHelper.hash(dto.password);
    const createdUser = new this.userModel({
      ...dto,
      password: hashed,
    });

    try {
      await createdUser.save();
      return createdUser;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
      
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
  
    const isPasswordCorrect = await PasswordHashHelper.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('Could not find the user');
    }

    return user;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: number) {
    return this.userModel.findById(id).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }
  
  async remove(id: number) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
