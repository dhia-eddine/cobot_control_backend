import { Trajectory } from 'src/trajectories/trajectory.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Cobot {
  @PrimaryColumn()
  reference: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  ipAddress: string;

  @Column()
  createdBy: string;

  @Column('jsonb')
  configuration: {
    x: number;
    y: number;
    z: number;
    roll: number;
    pitch: number;
    yaw: number;
  };

  @Column({ type: 'text', nullable: true })
  status: string | null;

  @Column()
  online: boolean;

  @OneToMany(() => Trajectory, (trajectory) => trajectory.cobot)
  trajectories: Trajectory[];
}
