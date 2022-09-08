import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
  @IsOptional()
  @IsPositive()
  //@Type(() => Number) el cero no se toma como positivo
  @Min(0)
  offset?: number;
}
