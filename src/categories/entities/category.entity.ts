import { Product } from '../../products/entities/product.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 60})
    name: string

    @OneToMany( () => Product, (product) => product.id, {cascade: true} )
    products: Product[]
}
