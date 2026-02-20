import { Entity, PrimaryGeneratedColumn,Column, ManyToOne,JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class DailySummary{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:"date"})
    date!:string;

    @Column()
    totalIncome!:number;

    @Column()
    totalExpense!:number;

    @Column()
    balance!:number;

    @ManyToOne(()=>User,user=>user.entries,{eager:false})
    @JoinColumn({name:"userId"})
    user!:User;

    @Column()
    userId!: number;
}