import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Role } from './user.entity';

export class UserCreateDTO {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserUpdateDTO {
  @Expose()
  id: number;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  role?: Role;
}
