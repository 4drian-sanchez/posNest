import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionReposity : Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository : Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository : Repository<Product>,
    private readonly couponServise : CouponsService
  ){}

  async create(createTransactionDto: CreateTransactionDto) {
    
    await this.productRepository.manager.transaction( async (transactionEntityManager) => {

      const transaction = new Transaction()
      const total = createTransactionDto.contents.reduce( (total, item) => total + (item.quantity * item.price), 0)
      transaction.total = total
      if(createTransactionDto.coupon) {
        const coupon = await this.couponServise.applyCoupon(createTransactionDto.coupon)
        const discount = ((coupon.percentage / 100) * total).toString()
        transaction.discount = discount
        transaction.coupon = coupon.name
        transaction.total -= +discount
      }
      
      for(const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, {id: contents.productId})

        const errors : string[] = []
        if(!product) {
          errors.push(`El producto con el id ${contents.productId} no ha sido encontrado`)
          throw new NotFoundException(errors)
        }

        if(contents.quantity > product.inventary) {
          errors.push(`El articulo ${product.name} excede la cantidad disponible`)
          throw new BadRequestException(errors)
        }
        
        product.inventary -= contents.quantity

        //Create transactionContents instance
        const transactionContents = new TransactionContents()
        transactionContents.price = contents.price
        transactionContents.product = product
        transactionContents.quanity = contents.quantity
        transactionContents.transaction = transaction
        
        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContents)
      }

    })

    return 'Venta almacenada correctamente';

  }
  
  async findAll(transactionDate?: string) { 

    const options : FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }

    if(transactionDate) {
      const date = parseISO(transactionDate)
      if(!isValid(date)) {
        throw new BadRequestException('Fecha no válida')
      }
      
      const start = startOfDay(date)
      const end = endOfDay(date)
      options.where = {
        transactionDate: Between(start, end)
      }
    }
    return await this.transactionReposity.find(options)
  }

  async findOne(id: number) {
    const transaction = await this.transactionReposity.findOne({
      where:{
        id
      },
      relations: {
        contents: true
      }
    })

    if(!transaction) {
      throw new NotFoundException('Venta no encontrada')
    }

    return transaction
  }

  async remove(id: number) {
    const transaction = await this.findOne(id)

    for(const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({id: +contents.product.id})
      if(product) {
        product.inventary += contents.quanity
        await this.productRepository.save(product)
      }

      const transactionsContents = await this.transactionContentsRepository.findOneBy({id: contents.id})
      if(transactionsContents) await this.transactionContentsRepository.remove(transactionsContents)
    }

    await this.transactionReposity.remove(transaction)
    return `Venta eliminada`

  }
}
