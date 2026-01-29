import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  Put,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Get currently logged-in user profile
   * @param req - Express request object containing user from JWT
   * @returns Current user data without password
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Request() req: any) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request');
    }

    const currentUser = await this.usersService.findOne(req.user.id.toString());
    return {
      success: true,
      data: currentUser,
      message: 'User profile retrieved successfully',
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(_id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.usersService.remove(_id);
  }

  /**
   * Get current user's theme
   */
  @Get('me/theme')
  @UseGuards(JwtAuthGuard)
  async getTheme(@Request() req: any) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request');
    }
    const theme = await this.usersService.getTheme(req.user.id.toString());
    return { success: true, theme };
  }

  /**
   * Update current user's theme
   */
  @Put('me/theme')
  @UseGuards(JwtAuthGuard)
  async updateTheme(@Request() req: any, @Body() body: { theme: 'light' | 'dark' }) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request');
    }
    const updated = await this.usersService.updateTheme(req.user.id.toString(), body.theme);
    return { success: true, theme: updated.theme };
  }
}
