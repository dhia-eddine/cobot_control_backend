import {
  Controller,
  Post,
  InternalServerErrorException,
  Get,
  Body,
} from '@nestjs/common';
import { RobotTestConService } from './robot-test-con.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@Controller('ur10')
export class RobotTestConController {
  constructor(private readonly robotService: RobotTestConService) {}

  @UseGuards(AuthGuard)
  @Post('connect')
  connectToPythonClient(@Body() connectionData: { url?: string }) {
    const url = connectionData.url || 'http://localhost:5000';
    this.robotService.connectToPythonClient(url);
    return { message: `Connecting to Python client at ${url}` };
  }

  @UseGuards(AuthGuard)
  @Get('status')
  getRobotStatus() {
    return this.robotService.getRobotStatus();
  }
}
