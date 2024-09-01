import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { Repository, FindOneOptions, QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashServise: HashService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashServise.hashPassword(password),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === 23505) {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }

  async findMany(query: string) {
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async findByUsernameOrEmail(findUserDto: FindUsersDto) {
    const { query } = findUserDto;
    const user = await this.findMany(query);
    if (!user) {
      return;
    }
    delete user[0].password;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email || updateUserDto.username) {
      const userExist = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });
      if (!!userExist) {
        throw new ConflictException(
          'Пользователь с такой почтой или логином уже зарегистрирован',
        );
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashServise.hashPassword(
        updateUserDto.password,
      );
    }
    await this.userRepository.update({ id }, updateUserDto);

    const updatedUser = await this.findOne({
      where: { id: +id },
    });

    delete updatedUser.password;
    return updatedUser;
  }

  async findUserName(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async findWishes(id: number) {
    const user = await this.findOne({
      where: { id: id },
      relations: {
        wishes: {
          owner: true,
          offers: {
            item: { owner: true, offers: true },
            user: { wishes: true, offers: true, wishlists: true },
          },
        },
      },
    });

    const userWishes = user.wishes.filter((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));
      delete wish.owner.email;
      delete wish.owner.password;
      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      wish.price = Number(wish.price);
      return wish;
    });

    return userWishes;
  }
  async findUserById(id: number) {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    if (!user && !password) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }
}
