import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
  @IsString()
  @MinLength(3)
  user: string;
  @IsString()
  @MinLength(5)
  password: string;
  @IsString({each:true})
  @IsOptional()
  @IsArray()
  contacts?:string;
}
