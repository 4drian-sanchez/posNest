import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Category) private readonly categoryRepository : Repository<Category>,
    @InjectRepository(Product) private readonly productRepository : Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({id: createProductDto.categoryId})
    if(!category) {
      let error : string[] = []
      error.push('La categoria no ha sido encontrada')
      throw new NotFoundException(error)
    }

    return this.productRepository.save({
      ...createProductDto,
      category
    })
  }

  async findAll(categoryId: number | null, take: number, skip: number) {

    const options : FindManyOptions<Product>= {
      relations: {
        category: true
      },
      take: take,
      skip,
      order: {
        category: {
          id: 'DESC'
        }
      }
    }

    if(categoryId) {
      options.where = {
        category: { id: categoryId }
      }
    }

    const [products, total] = await this.productRepository.findAndCount(options)

    return {
      products,
      total
    }

  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id
      },
      relations: {
        category: true
      }
    })

    if(!product) {
      throw new NotFoundException(`El producto con el id ${id} no ha sido encontrado`)
    }

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    Object.assign(product, updateProductDto)

    if(updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({id: updateProductDto.categoryId})
      if(!category) {
        let error : string[] = []
        error.push('La categoria no ha sido encontrada')
        throw new NotFoundException(error)
      }

      product.category = category
    }

    return await this.productRepository.save(product)
  }

  async remove(id: number) {
    const product = await this.findOne(id)
    await this.productRepository.delete(product)
    return 'producto eliminado'
  }
}
