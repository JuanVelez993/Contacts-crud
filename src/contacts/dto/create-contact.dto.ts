import { IsArray, IsBoolean, IsOptional,IsString, MinLength } from 'class-validator';
import { Phone } from 'src/phone/entities/phone.entity';

export class CreateContactDto {
  @IsString()
  user:{id:string};
  @IsString()
  @MinLength(3)
  name: string;
  @IsString()
  @MinLength(3)
  lastname: string;
  @IsBoolean()
  status:boolean;
  @IsOptional()
  @IsArray()
  phones?:Phone[];
}