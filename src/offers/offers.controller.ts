import {
  Controller,
  UseGuards,
  Param,
  Body,
  Get,
  Req,
  Post,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TUser } from 'src/types/types';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Req() req: TUser, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
