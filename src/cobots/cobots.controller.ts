import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
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
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    // Parse page and limit from query, fallback to defaults if not provided
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.cobotsService.findAll(pageNumber, limitNumber);
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
  @Post(':reference/ip')
  async updateIpAddress(
    @Param('reference') reference: string,
    @Body('ipAddress') ipAddress: string,
  ) {
    await this.cobotsService.updateIpAddress(reference, ipAddress);
    return { message: 'Cobot IP address updated successfully' };
  }
}
