import { Module } from '@nestjs/common';
import { RobotTestConController } from './robot-test-con.controller';
import { RobotTestConService } from './robot-test-con.service';
import { RobotGateway } from './robot.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trajectory } from '../trajectories/trajectory.entity';
import { Cobot } from 'src/cobots/cobot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trajectory, Cobot])],

  controllers: [RobotTestConController],
  providers: [RobotTestConService, RobotGateway],
  exports: [RobotTestConService],
})
export class RobotTestConModule {}
