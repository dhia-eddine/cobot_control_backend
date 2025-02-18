import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrajectoriesService } from './trajectories.service';
import { CreateTrajectoryDto } from './dto/create-trajectory.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('cobots/:cobotReference/trajectories')
export class TrajectoriesController {
  constructor(private readonly trajectoriesService: TrajectoriesService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Body() createTrajectoryDto: CreateTrajectoryDto,
    @Param('cobotReference') cobotReference: string,
  ): Promise<{ message: string }> {
    await this.trajectoriesService.createTrajectory(
      createTrajectoryDto,
      cobotReference,
    );
    return { message: 'Trajectory created successfully' };
  }

  @Get()
  async findAll() {
    return this.trajectoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.trajectoriesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.trajectoriesService.remove(id);
  }
}
