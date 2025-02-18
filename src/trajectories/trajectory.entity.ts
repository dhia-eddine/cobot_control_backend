import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cobot } from '../cobots/cobot.entity';

@Entity()
export class Trajectory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  configuration: {
    x: number;
    y: number;
    z: number;
    roll: number;
    pitch: number;
    yaw: number;
  }[];

  @ManyToOne(() => Cobot, (cobot) => cobot.trajectories, {
    onDelete: 'CASCADE',
  })
  cobot: Cobot;
}
