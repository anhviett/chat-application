import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsIn(['light', 'dark'])
  @IsOptional()
  theme?: 'light' | 'dark';
}
