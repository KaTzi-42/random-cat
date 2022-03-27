import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ImageFormat } from './cats.entity';

export class CatDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(
    ImageFormat,
    { message: `Кот долже быть в одном из форматов ${Object.values(ImageFormat)}` })
  type: ImageFormat;
}
