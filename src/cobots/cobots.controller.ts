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

@Controller('cobots')
export class CobotsController {
  constructor(private readonly cobotsService: CobotsService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete(':reference')
  async remove(@Param('reference') reference: string) {
    return this.cobotsService.remove(reference);
  }
}
