import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsEmpty } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";

export class LoginAuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class RegisterAuthDto extends LoginAuthDto {
    @ApiProperty()
    @IsEmpty()
    phoneNumber: string;

    @ApiProperty()
    gender: Gender;

    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;
}

export class CreateAuthDto extends LoginAuthDto {}
