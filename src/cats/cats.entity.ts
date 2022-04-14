import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  GIF = 'gif'
}

@Entity()
export class Cat {
      @PrimaryGeneratedColumn()
    id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ImageFormat
  })
  type: ImageFormat;

  @Column({
    name: 'is_checked',
    default: false,
  })
  isChecked: boolean;
}
