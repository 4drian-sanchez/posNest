import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
        @IsNotEmpty({message: 'El nombre de la categoría no puede ir vacio'})
        @IsString({message: 'Nombre no válido'})
        name: string
}
