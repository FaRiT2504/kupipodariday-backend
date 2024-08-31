import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { UsersModule } from 'src/users/users.module';
import { OffersModule } from 'src/offers/offers.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    forwardRef(() => OffersModule),
    forwardRef(() => UsersModule),
  ],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
