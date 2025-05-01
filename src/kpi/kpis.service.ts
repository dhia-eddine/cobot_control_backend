import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kpi } from './kpi.entity';
import { Cobot } from '../cobots/cobot.entity';
import { CreateKpiDto } from './create-kpi.dto';

@Injectable()
export class KpisService {
  private intervalsMap: Record<string, NodeJS.Timer> = {};
  private summaryIntervalsMap: Record<string, NodeJS.Timer> = {};

  constructor(
    @InjectRepository(Kpi)
    private readonly kpiRepository: Repository<Kpi>,
    @InjectRepository(Cobot)
    private readonly cobotRepository: Repository<Cobot>,
  ) {}

  /**
   * Generate a random KPI for a given Cobot and save it to the database.
   */
  async createKpiForCobot(
    reference: string,
    createKpiDto: CreateKpiDto,
  ): Promise<Kpi> {
    const cobot = await this.cobotRepository.findOne({ where: { reference } });
    if (!cobot) {
      throw new Error(`Cobot with reference ${reference} not found`);
    }

    const newKpi = this.kpiRepository.create({
      cobot,
      cobotReference: cobot.reference,
      startDate: createKpiDto.startDate,
      endDate: createKpiDto.endDate,
      sprayingTime: createKpiDto.sprayingTime || null,
      quantityGlueUsed: createKpiDto.quantityGlueUsed || null,
    });

    return this.kpiRepository.save(newKpi);
  }
  async generateKpiForCobot(reference: string): Promise<Kpi> {
    const cobot = await this.cobotRepository.findOne({ where: { reference } });
    if (!cobot) {
      throw new Error(`Cobot with reference ${reference} not found`);
    }

    // Randomly generate dates (for demonstration, we just pick some offset)
    const now = new Date();
    const startOffset = Math.floor(Math.random() * 60);
    const startDate = new Date(now.getTime() - startOffset * 60000);

    const endDate = new Date(
      startDate.getTime() + Math.floor(Math.random() * 30) * 60000,
    );

    const quantityGlueUsed = parseFloat((Math.random() * 10).toFixed(2));

    const randomSeconds = Math.floor(Math.random() * 1800); // up to 30 min
    const sprayingTime = new Date();
    sprayingTime.setHours(0, 0, 0, 0);
    sprayingTime.setSeconds(randomSeconds);

    const newKpi = this.kpiRepository.create({
      cobot,
      cobotReference: cobot.reference,
      startDate,
      endDate,
      sprayingTime,
      quantityGlueUsed,
    });

    return this.kpiRepository.save(newKpi);
  }

  async findAllKpis(): Promise<Kpi[]> {
    return this.kpiRepository.find();
  }

  async findAllKpisForCobot(reference: string): Promise<Kpi[]> {
    return this.kpiRepository.find({ where: { cobotReference: reference } });
  }

  async getKpiSummaryForCobot(reference: string): Promise<any> {
    const kpis = await this.findAllKpisForCobot(reference);

    const numberOfProducedPieces = kpis.length;
    const totalQuantityGlue = kpis.reduce(
      (sum, kpi) => sum + (kpi.quantityGlueUsed ?? 0),
      0,
    );

    const totalOperatingTime = kpis.reduce(
      (sum, kpi) => sum + (kpi.endDate.getTime() - kpi.startDate.getTime()),
      0,
    );
    const totalSprayingTime = kpis.reduce((sum, kpi) => {
      // Calculate the duration in milliseconds from midnight of the sprayingTime's day
      if (!kpi.sprayingTime) return sum;
      const baseline = new Date(kpi.sprayingTime);
      baseline.setHours(0, 0, 0, 0);
      const sprayingDuration = kpi.sprayingTime.getTime() - baseline.getTime();
      return sum + sprayingDuration;
    }, 0);

    const averageTimePerPiece = totalOperatingTime / numberOfProducedPieces;

    return {
      numberOfProducedPieces,
      totalQuantityGlue: Number(totalQuantityGlue.toFixed(3)),
      totalOperatingTime: this.formatMillisecondsToHms(totalOperatingTime),
      totalSprayingTime: this.formatMillisecondsToHms(totalSprayingTime),
      averageTimePerPiece: this.formatMillisecondsToHms(averageTimePerPiece),
    };
  }

  private formatMillisecondsToHms(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  startKpiInterval(reference: string): void {
    // If an interval already exists for this reference, do nothing
    if (this.intervalsMap[reference]) {
      return;
    }

    this.intervalsMap[reference] = setInterval(async () => {
      try {
        await this.generateKpiForCobot(reference);
      } catch (err) {
        console.error(`Failed to generate KPI: ${err.message}`);
      }
    }, 2_000);
  }

  /**
   * Stops an existing interval generating KPIs for a given reference.
   * Returns true if an interval was found, otherwise false.
   */
  stopKpiInterval(reference: string): boolean {
    if (this.intervalsMap[reference]) {
      clearInterval(this.intervalsMap[reference] as NodeJS.Timeout);
      delete this.intervalsMap[reference];
      return true;
    }
    return false;
  }

  startKpiSummaryInterval(reference: string): void {
    // If an interval already exists for this reference, do nothing.
    if (this.summaryIntervalsMap[reference]) {
      return;
    }
    this.summaryIntervalsMap[reference] = setInterval(async () => {
      try {
        const summary = await this.getKpiSummaryForCobotRealTime(reference);

        // Here you would usually send data to a client
        // (for example, using a WebSocket event or SSE).
        console.log(
          `Real-time summary for ${reference}:`,
          JSON.stringify(summary, null, 2),
        );
      } catch (err) {
        console.error(`Failed to get real-time KPI summary: ${err.message}`);
      }
    }, 1_000);
  }

  async getKpiSummaryForCobotRealTime(reference: string): Promise<any> {
    // You might choose to filter for a specific time frame (e.g., last 5 minutes).
    // For demonstration, this example reuses the same logic as getKpiSummaryForCobot.
    return this.getKpiSummaryForCobot(reference);
  }

  stopKpiSummaryInterval(reference: string): boolean {
    if (this.summaryIntervalsMap[reference]) {
      clearInterval(this.summaryIntervalsMap[reference] as NodeJS.Timeout);
      delete this.summaryIntervalsMap[reference];
      return true;
    }
    return false;
  }
}
