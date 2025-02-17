import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

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
}
