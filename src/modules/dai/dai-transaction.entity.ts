import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DaiTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blockNumber: number;

  @Column()
  timestamp: Date;

  @Column()
  sender: string;

  @Column()
  recipient: string;

  @Column()
  value: string;

  @Column()
  txHash: string;
}
