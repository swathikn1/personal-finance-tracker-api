import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

export enum EntryType{
    INCOME="income",
    EXPENSE="expense"
}

@Entity()
 export class Entries{
    @PrimaryGeneratedColumn()
    id!:number
    
    @Column()
    amount!:number
    
    @Column({
        type:"enum",
        enum:EntryType,
    })
    type!:EntryType;
    
    @Column()
    category!:string
    
    @Column()
    description!:string
    
    @Column({type:"date"})
    date!:string

}
