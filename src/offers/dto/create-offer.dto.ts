import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  public amount: number;

  @IsNumber()
  public itemId: number;

  @IsBoolean()
  @IsOptional()
  public hidden: boolean = false;
}
