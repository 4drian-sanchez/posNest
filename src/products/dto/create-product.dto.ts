import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message: 'El nombre no puede ir vacio'})
    @IsString({message: 'Nombre no válido'})
    name: string

    @IsNotEmpty({message: 'El precio no puede ir vacio'})
    @IsNumber({maxDecimalPlaces: 2}, {message: 'Precio no válido'})
    price: number

    @IsNotEmpty({message: 'El inventario no puede ir vacio'})
    @IsNumber({maxDecimalPlaces: 0}, {message: 'Inventario no válido'})
    inventary: number

    @IsNotEmpty({message: 'La categoriaId no puede ir vacio'})
    @IsInt({message: 'Inventario no válido'})
    categoryId: number
}
