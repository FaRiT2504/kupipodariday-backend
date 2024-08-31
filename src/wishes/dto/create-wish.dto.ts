import { IsNumber, Min, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsUrl()
  link: string;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;
}
