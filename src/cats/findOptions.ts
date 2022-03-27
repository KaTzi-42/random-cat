import { Expose, Transform } from 'class-transformer';
import { ImageFormat } from './cats.entity';

export class FindCatOptions {
  @Expose()
  onValidation?: boolean | 1 | 0;

  @Expose()
  onlyChecked?: boolean | 1 | 0;

  @Expose()
  @Transform(({ value }) => (value ? value.toUpperCase() : undefined))
  sort?: 'ASC' | 'DESC';

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  type?: keyof typeof ImageFormat;
}
