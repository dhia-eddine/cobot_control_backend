import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trajectory } from './trajectory.entity';
import { CreateTrajectoryDto } from './dto/create-trajectory.dto';
import { Cobot } from '../cobots/cobot.entity';
import { UpdateTrajectoryDto } from './dto/update-trajectory.dto';

@Injectable()
export class TrajectoriesService {
  constructor(
    @InjectRepository(Trajectory)
    private readonly trajectoryRepository: Repository<Trajectory>,
    @InjectRepository(Cobot)
    private readonly cobotRepository: Repository<Cobot>,
  ) {}

  async createTrajectory(
    createTrajectoryDto: CreateTrajectoryDto,
    cobotReference: string,
  ): Promise<Trajectory> {
    const cobot = await this.cobotRepository.findOne({
      where: { reference: cobotReference },
    });

    if (!cobot) {
      throw new NotFoundException(
        `Cobot with reference ${cobotReference} not found`,
      );
    }

    const trajectory = this.trajectoryRepository.create({
      ...createTrajectoryDto,
      cobot,
    });

    return this.trajectoryRepository.save(trajectory);
  }

  async findAll(): Promise<Trajectory[]> {
    return this.trajectoryRepository.find();
  }

  async findOne(id: number): Promise<Trajectory> {
    const trajectory = await this.trajectoryRepository.findOneBy({ id });
    if (!trajectory) {
      throw new NotFoundException(`Trajectory with ID ${id} not found`);
    }
    return trajectory;
  }

  async updateTrajectory(
    id: number,
    updateTrajectoryDto: UpdateTrajectoryDto,
  ): Promise<Trajectory> {
    const trajectory = await this.trajectoryRepository.findOneBy({ id });
    if (!trajectory) {
      throw new NotFoundException(`Trajectory with ID ${id} not found`);
    }

    Object.assign(trajectory, updateTrajectoryDto);

    return this.trajectoryRepository.save(trajectory);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.trajectoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Trajectory with ID ${id} not found`);
    }
    return { message: 'Trajectory deleted successfully' };
  }
}
