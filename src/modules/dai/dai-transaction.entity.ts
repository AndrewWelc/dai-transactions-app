import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DaiTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'block_number' })
  blockNumber: number;

  @Column()
  timestamp: Date;

  @Column()
  sender: string;

  @Column()
  recipient: string;

  @Column()
  value: string;

  @Column({ name: 'tx_hash' })
  txHash: string;
}
