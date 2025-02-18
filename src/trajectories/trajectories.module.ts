import { Module } from '@nestjs/common';
import { TrajectoriesController } from './trajectories.controller';
import { TrajectoriesService } from './trajectories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trajectory } from './trajectory.entity';
import { Cobot } from 'src/cobots/cobot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trajectory, Cobot])],
  controllers: [TrajectoriesController],
  providers: [TrajectoriesService],
})
export class TrajectoriesModule {}
