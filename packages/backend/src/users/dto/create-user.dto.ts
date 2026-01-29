

import { IsEmail, IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsIn(['light', 'dark'])
  @IsOptional()
  theme?: 'light' | 'dark';

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  gender?: string;
}
