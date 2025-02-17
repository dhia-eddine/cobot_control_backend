import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cobot } from './cobot.entity';
import { CreateCobotDto } from './dto/create-cobot.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CobotsService {
  constructor(
    @InjectRepository(Cobot)
    private readonly cobotRepository: Repository<Cobot>,
    private readonly usersService: UsersService,
  ) {}

  async createCobot(
    createCobotDto: CreateCobotDto,
    createdById: number,
  ): Promise<Cobot> {
    const { reference, ipAddress } = createCobotDto;

    const cobot = this.cobotRepository.create({
      reference,
      ipAddress,
      createdBy: createdById,
      configuration: {
        x: 0,
        y: 0,
        z: 0,
        roll: 0,
        pitch: 0,
        yaw: 0,
      },
      status: null,
      online: false,
    });

    return this.cobotRepository.save(cobot);
  }

  async findAll(): Promise<Cobot[]> {
    return this.cobotRepository.find();
  }

  async findOne(reference: string): Promise<Cobot> {
    const cobot = await this.cobotRepository.findOne({ where: { reference } });
    if (!cobot) {
      throw new Error(`Cobot with reference ${reference} not found`);
    }
    return cobot;
  }

  async remove(reference: string): Promise<void> {
    await this.cobotRepository.delete(reference);
  }
}
