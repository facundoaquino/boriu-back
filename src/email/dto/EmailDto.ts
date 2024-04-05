import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  order: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
