import {
  Controller,
  Header,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { TUser } from 'src/types/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getUser(@Req() req: TUser) {
    return this.usersService.findOne({ where: { id: req.user.id } });
  }

  @Patch('me')
  update(@Req() req: TUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes(@Req() req) {
    return this.wishesService.find({
      where: { owner: { id: +req.user.id } },
      relations: { offers: true },
    });
  }

  @Post('find')
  @Header('Content-Type', 'application/json')
  async findUserByEmailOrUserName(@Body() findUserDto: FindUsersDto) {
    return this.usersService.findByUsernameOrEmail(findUserDto);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findUserName(username);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string) {
    return this.usersService.findUserName(username);
  }
}
