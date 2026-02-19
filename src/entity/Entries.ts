import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum EntryType {
  INCOME = "income",
  EXPENSE = "expense",
}

@Entity()
export class Entries {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @Column({ type: "enum", enum: EntryType })
  type!: EntryType;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column({ type: "date" })
  date!: string;

  @ManyToOne(() => User, (user) => user.entries, { eager: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number; 
}