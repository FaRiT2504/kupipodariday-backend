import { Post, UseGuards, Controller, Body, Req } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { TUser } from 'src/types/types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: TUser) {
    return this.authService.auth(req.user);
  }
}
