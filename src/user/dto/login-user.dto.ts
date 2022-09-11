import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { Contact } from 'src/contacts/entities/contact.entity';


export class LoginUserDto {
  @IsString()
  @MinLength(3)
  user: string;
  @IsString()
  @MinLength(5)
  /*@Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
})*/
  password: string;
  @IsOptional()
  @IsArray()
  contacts?:Contact[]
}