import { IsString, MinLength } from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  contact:{id:string};
  @IsString()
  @MinLength(7)
  phone: string;
}
