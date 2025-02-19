import { Controller, Post, Param, Get } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { Kpi } from './kpi.entity';

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
}
