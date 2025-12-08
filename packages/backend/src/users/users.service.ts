import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    // Hash password - bcrypt includes salt automatically
    const hashedPassword = await PasswordHashHelper.hash(dto.password);

    const createdUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      username: dto.username || dto.email.split('@')[0], // Use email prefix as default username
      password: hashedPassword,
      about: dto.about,
      birthday: dto.birthday,
      height: dto.height,
      weight: dto.weight,
      gender: dto.gender,
      interests: [],
    });

    try {
      const savedUser = await createdUser.save();
      console.log('✅ User created successfully:', savedUser._id);
      return this.sanitizeUser(savedUser);
    } catch (error) {
      console.error('❌ Error creating user:', error.message);
      if (error.errInfo?.details) {
        console.error('Validation details:', JSON.stringify(error.errInfo.details, null, 2));
      }
      console.error('Full error:', error);
      throw new BadRequestException(error.message || 'Error creating user');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await PasswordHashHelper.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('Invalid credentials');
    }

    return this.sanitizeUser(user);
  }

  async registerUser(dto: CreateUserDto) {
    return this.create(dto);
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
  }
}
