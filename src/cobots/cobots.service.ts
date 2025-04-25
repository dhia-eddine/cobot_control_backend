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
    const createdByUser = await this.usersService.findOne(createdById);
    if (!createdByUser) {
      throw new Error(`User with ID ${createdById} not found`);
    }

    const cobot = this.cobotRepository.create({
      reference,
      ipAddress,
      createdBy: createdByUser.name,
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

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Cobot[];
    firstPage: number;
    lastPage: number;
    total: number;
    page: number;
  }> {
    // Ensure page and limit are positive integers
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const [data, total] = await this.cobotRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const lastPage = Math.max(1, Math.ceil(total / limit));
    return {
      data,
      firstPage: 1,
      lastPage,
      total,
      page,
    };
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

  async resetStatuses(): Promise<void> {
    await this.cobotRepository.update({}, { status: 'stopped' });
  }

  async onApplicationBootstrap() {
    await this.resetStatuses();
    console.log('All cobots have been reset to stopped status.');
  }

  async onApplicationShutdown() {
    await this.resetStatuses();
    console.log('All cobots have been reset to stopped status.');
  }

  async updateStatus(reference: string, status: string): Promise<void> {
    const cobot = await this.cobotRepository.findOne({ where: { reference } });
    if (!cobot) {
      throw new Error(`Cobot with reference ${reference} not found`);
    }
    cobot.status = status;
    await this.cobotRepository.save(cobot);
  }
  async updateIpAddress(reference: string, ipAddress: string): Promise<void> {
    const cobot = await this.cobotRepository.findOne({ where: { reference } });
    if (!cobot) {
      throw new Error(`Cobot with reference ${reference} not found`);
    }
    cobot.ipAddress = ipAddress;
    await this.cobotRepository.save(cobot);
  }
}
