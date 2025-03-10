import { IsNumberString, IsOptional } from "class-validator";

export class GetProductQueryDto {
    @IsOptional()
    @IsNumberString({}, {message: 'Id no válido'})
    product_id?: number

    @IsOptional()
    @IsNumberString({}, {message: 'la cantidad no es válida'})
    take:number

    @IsOptional()
    @IsNumberString({}, {message: 'la cantidad no es válida'})
    skip:number
}