import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
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
  role: Role;

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
