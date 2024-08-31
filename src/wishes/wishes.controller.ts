import {
  Patch,
  Post,
  Req,
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { TUser } from 'src/types/types';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: TUser) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWishlistlists(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: number,
    @Req() req: TUser,
  ) {
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req: TUser) {
    return this.wishesService.copy(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteWish(@Param('id') id: number, @Req() req: TUser) {
    return this.wishesService.deleteOne(id, req.user.id);
  }
}
