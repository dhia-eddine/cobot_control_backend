import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CobotsService } from './cobots.service';
import { CreateCobotDto } from './dto/create-cobot.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: number; email: string; role: string };
}
@UseGuards(AuthGuard)
@Controller('cobots')
export class CobotsController {
  constructor(private readonly cobotsService: CobotsService) {}

  @Post()
  async create(
    @Body() createCobotDto: CreateCobotDto,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    const userId = req.user.id;
    await this.cobotsService.createCobot(createCobotDto, userId);
    return { message: 'Cobot created successfully' };
  }

  @Get()
  async findAll() {
    return this.cobotsService.findAll();
  }

  @Get(':reference')
  async findOne(@Param('reference') reference: string) {
    return this.cobotsService.findOne(reference);
  }

  @Delete(':reference')
  async remove(@Param('reference') reference: string) {
    await this.cobotsService.remove(reference);
    return { message: 'Cobot deleted successfully' };
  }

  @Post(':reference/start')
  async start(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    await this.cobotsService.updateStatus(reference, 'running');
    return {
      message: `Cobot with reference ${reference} started successfully`,
    };
  }

  @Post(':reference/stop')
  async stop(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    await this.cobotsService.updateStatus(reference, 'stopped');
    return {
      message: `Cobot with reference ${reference} stopped successfully`,
    };
  }

  @Post(':reference/pause')
  async pause(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    await this.cobotsService.updateStatus(reference, 'paused');
    return { message: `Cobot with reference ${reference} paused successfully` };
  }
}
