import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum Role {
  User = 'user',
  Admin = 'admin'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum', enum: Role, default: Role.User
  })
  role: Role;

  @CreateDateColumn({
    type: 'timestamp', name: 'create_at'
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp', name: 'update_at'
  })
  updateAt: Date;
}
