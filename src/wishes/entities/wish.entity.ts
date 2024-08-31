import {
  Min,
  Length,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  IsPositive,
} from 'class-validator';
import {
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  copied: number;

  @Column()
  @IsUrl()
  @IsString()
  link: string;

  @Column()
  @IsUrl()
  @IsString()
  image: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  raised: number;

  @Column({ length: 1024 })
  @IsNotEmpty()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
