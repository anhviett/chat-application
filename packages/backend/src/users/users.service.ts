import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: RegisterAuthDto) {
    const passwordGenerator = await PasswordHashHelper.hash(dto.password);
    dto.password = passwordGenerator;

    const createdUser = new this.userModel({
      ...dto,
      password_key: passwordGenerator.key,
    });

    try {
      await createdUser.save();
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password +password_key')
      .exec();
      
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
  
    const isPasswordCorrect = await PasswordHashHelper.comparePassword(password, user.password_key, user.password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('Could not find the user');
    }

    return user;
  }
}
