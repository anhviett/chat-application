import { Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Assume UsersService is defined and imported
    private readonly jwtService: JwtService, // Assume JwtService is defined and imported
  ) {

  }

  async login(loginAuthDto: LoginAuthDto) {
    const validator = await this.usersService.validateUser(loginAuthDto.email, loginAuthDto.password);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  login(createAuthDto: CreateAuthDto) {
    return `This action logs in a user with email ${createAuthDto.email}`;
  }
}
