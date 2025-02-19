import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Cobot } from '../cobots/cobot.entity';

@Entity()
export class Kpi {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cobot, (cobot) => cobot.reference, { onDelete: 'CASCADE' })
  cobot: Cobot;

  @Column()
  cobotReference: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'timestamptz' })
  sprayingTime: Date;

  @Column('float')
  quantityGlueUsed: number;

  @CreateDateColumn()
  createdAt: Date;
}
