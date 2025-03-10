import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'decimal'})
    total: number

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
    transactionDate: Date

    @Column({type: 'varchar', length: 30, nullable: true})
    coupon: string

    @Column({type: 'decimal', nullable: true, default: 0})
    discount: string

    @OneToMany( () => TransactionContents, (transaction) => transaction.transaction )
    contents: TransactionContents[]
}

@Entity()
export class TransactionContents {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'int', nullable: true})
    quanity: number

    @Column({type: 'decimal'})
    price: number

    @ManyToOne( () => Product, (product) => product.id, {eager: true, cascade: true}  )
    product: Product

    @ManyToOne( () => Transaction, (transaction) => transaction.contents, {cascade: true})
    transaction: Transaction
}
