import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );

    const payload = { sub: user._id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
