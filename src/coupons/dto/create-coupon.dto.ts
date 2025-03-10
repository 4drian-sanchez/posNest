import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator"

export class CreateCouponDto {
    
        @IsNotEmpty({message: 'El nombre del cupón no puede ir vacio'})
        name: string
    
        @IsNotEmpty({message: 'El cupón no puede ir vacio'})
        @IsInt({message: 'Porcentaje no válido'})
        @Max(100, {message: 'El cupón tiene un máximo de 100% de descuento'})
        @Min(1, {message: 'EL procentaje no puede ser menor a 1'})
        percentage: number
    
        @IsNotEmpty({message: 'La fecha no puede ir vácia'})
        @IsDateString({}, {message: 'La fecha no es válida'})
        expirationDate: Date
}
