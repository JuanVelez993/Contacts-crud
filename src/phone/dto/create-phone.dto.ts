import { IsString, MinLength } from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @MinLength(7)
  phone: string;
}
