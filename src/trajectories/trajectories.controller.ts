import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { TrajectoriesService } from './trajectories.service';
import { CreateTrajectoryDto } from './dto/create-trajectory.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateTrajectoryDto } from './dto/update-trajectory.dto';

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

  // NEW: Get all trajectories for a specific cobot
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Param('cobotReference') cobotReference: string) {
    return this.trajectoriesService.findAllForCobot(cobotReference);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.trajectoriesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTrajectoryDto: UpdateTrajectoryDto,
  ) {
    return this.trajectoriesService.updateTrajectory(id, updateTrajectoryDto);
  }

  @UseGuards(AuthGuard)
  @Post(':trajectoryId/execute')
  async execute(
    @Param('trajectoryId') trajectoryId: number,
  ): Promise<{ message: string }> {
    // Placeholder for execution logic
    return {
      message: `Trajectory with ID ${trajectoryId} executed successfully`,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.trajectoriesService.remove(id);
    return { message: 'Trajectory deleted successfully' };
  }
}
