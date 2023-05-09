import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiRequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'api_key' })
  apiKey: string;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ name: 'status_code' })
  statusCode: number;

  @Column({ name: 'response_time' })
  responseTime: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
