import { Transform } from 'class-transformer';
import { ImageFormat } from './cats.entity';

export class FindCatOptions {
  @Transform(({ value }) => ([true, 'true', 1].indexOf(value) > -1))
  onValidation?: boolean | 1 | 0;

  @Transform(({ value }) => (value ? value.toUpperCase() : value), { toPlainOnly: true })
  sort?: 'ASC' | 'DESC';

  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  type?: keyof typeof ImageFormat;
}
