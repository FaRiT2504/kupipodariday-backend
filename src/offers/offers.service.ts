import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    console.log('log1', createOfferDto.amount);
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: {
        offers: true,
        owner: true,
      },
    });
    console.log('log2', wish.price);
    console.log('log3', wish.raised);

    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя донатить самому себе');
    }
    const offerAmountsArr = wish.offers.map((offer) => Number(offer.amount));
    const sum = offerAmountsArr.reduce(function (acc, val) {
      return acc + val;
    }, 0);

    wish.raised = sum;
    console.log('log4', wish.raised);

    if (
      wish.raised > wish.price ||
      wish.raised + createOfferDto.amount > wish.price
    ) {
      throw new ForbiddenException('Слишком много - тоже плохо');
    }
    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    if (offer.hidden === false) {
      delete offer.user;
      return this.offerRepository.save(offer);
    }

    delete offer.user.email;
    delete offer.user.password;
    delete offer.item.owner.email;
    delete offer.item.owner.password;

    return this.offerRepository.save(offer);
  }

  async find(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });
    offers.forEach((offer) => {
      if (offer.user) {
        delete offer.user.password;
      }
    });
    return offers;
  }

  async findOfferById(id: number) {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(`Предложение с таким id ${id} не найдено.`);
    }
    return offer;
  }
}
