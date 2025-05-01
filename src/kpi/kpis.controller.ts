import { Controller, Post, Param, Get, UseGuards, Body } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { Kpi } from './kpi.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateKpiDto } from './create-kpi.dto';

@UseGuards(AuthGuard)
@Controller('cobots')
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  /**
   * POST /cobots/:reference/kpi/create
   * Generates a random KPI for the given cobot reference.
   */
  @Post(':reference/kpi/create')
  async createKpi(@Param('reference') reference: string): Promise<Kpi> {
    return this.kpisService.generateKpiForCobot(reference);
  }

  @Get('/kpis')
  async findAllKpis(): Promise<Kpi[]> {
    return this.kpisService.findAllKpis();
  }

  @Get(':reference/kpis')
  async findAllKpisForCobot(
    @Param('reference') reference: string,
  ): Promise<Kpi[]> {
    return this.kpisService.findAllKpisForCobot(reference);
  }

  @Get(':reference/kpis/summary')
  async getKpiSummaryForCobot(
    @Param('reference') reference: string,
  ): Promise<any> {
    return this.kpisService.getKpiSummaryForCobot(reference);
  }

  @Get(':reference/kpis-real-time')
  async startGeneratingRealTimeKpis(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    this.kpisService.startKpiInterval(reference);
    return {
      message: `Started generating KPI for cobot ${reference} every 2 seconds.`,
    };
  }

  /**
   * GET /cobots/:reference/kpis-real-time/stop
   * Stops the interval that generates KPIs for the specified cobot.
   */
  @Get(':reference/kpis-real-time/stop')
  async stopGeneratingRealTimeKpis(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    const stopped = this.kpisService.stopKpiInterval(reference);
    if (stopped) {
      return { message: `Stopped generating KPI for cobot ${reference}.` };
    }
    return {
      message: `No active KPI generation interval found for cobot ${reference}.`,
    };
  }

  @Get(':reference/kpis-summary-real-time')
  async startSendingRealTimeSummary(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    this.kpisService.startKpiSummaryInterval(reference);
    return {
      message: `Started sending KPI summary for cobot ${reference} every 1 second.`,
    };
  }

  @Get(':reference/kpis-summary-real-time/stop')
  async stopSendingRealTimeSummary(
    @Param('reference') reference: string,
  ): Promise<{ message: string }> {
    const stopped = this.kpisService.stopKpiSummaryInterval(reference);
    if (stopped) {
      return { message: `Stopped sending KPI summary for cobot ${reference}.` };
    }
    return {
      message: `No active KPI summary interval found for cobot ${reference}.`,
    };
  }

  @Post(':reference/kpis')
  async createCustomKpi(
    @Param('reference') reference: string,
    @Body() createKpiDto: CreateKpiDto,
  ): Promise<Kpi> {
    return this.kpisService.createKpiForCobot(reference, createKpiDto);
  }
}
