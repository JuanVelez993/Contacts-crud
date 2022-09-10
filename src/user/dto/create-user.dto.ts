import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { Contact } from 'src/contacts/entities/contact.entity';


export class CreateUserDto {
  @IsString()
  @MinLength(3)
  user: string;
  @IsString()
  @MinLength(5)
  password: string;
  @IsOptional()
  @IsArray()
  contacts?:string[]
}
