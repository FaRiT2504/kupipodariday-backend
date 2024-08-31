import {
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { IsString, IsOptional, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsOptional()
  image?: string;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description?: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
