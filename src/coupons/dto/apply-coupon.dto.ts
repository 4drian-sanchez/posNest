import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {
    @IsNotEmpty({message: 'El nombre del cupón no puede ir vacio'})
    coupon_name: string
}