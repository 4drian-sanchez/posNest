import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { isAfter } from 'date-fns';

@Injectable()
export class CouponsService {

  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ){}

  async create(createCouponDto: CreateCouponDto) {
    return await this.couponRepository.save(createCouponDto)
  }

  findAll() {
    return this.couponRepository.find()
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({id})
    if(!coupon) {
      throw new NotFoundException(`El cupón con el id ${id} no ha sido encontrado`)
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id)
    Object.assign(coupon, updateCouponDto)
    return this.couponRepository.save(coupon)
  }

  async remove(id: number) {
    const coupon = await this.findOne(id)
    await this.couponRepository.delete(coupon)
    return {message: 'Cupón eliminado'}
  }

  async applyCoupon(coupon_name: string) {
    const coupon = await this.couponRepository.findOneBy({name: coupon_name})
    if(!coupon) {
      throw new NotFoundException('Cupón no encontrado')
    }

    const currentDay = new Date()
    const expirationDate = coupon.expirationDate

    if(isAfter(currentDay, expirationDate)) {
      throw new UnprocessableEntityException('Cupón ya expirado')
    }

    return {
      message: 'Cupón válido',
      ...coupon
    }
  }
}
