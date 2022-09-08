import { IsArray, IsOptional,IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(3)
  name: string;
  @IsString()
  @MinLength(3)
  lastname: string;
  @IsString({each:true})
  @IsOptional()
  @IsArray()
  phone?:string
}
