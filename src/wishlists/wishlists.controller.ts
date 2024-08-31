import {
  Req,
  UseGuards,
  Body,
  Delete,
  Get,
  Param,
  Controller,
  Patch,
  Post,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { TUser } from 'src/types/types';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}
  @Get()
  getWishlists() {
    return this.wishlistsService.get();
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishListDto: CreateWishlistDto, @Req() req: TUser) {
    return this.wishlistsService.create(req.user, createWishListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeWishlist(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.deleteOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWishlistsById(@Param('id') id: string) {
    return this.wishlistsService.getById(Number(id));
  }
}
