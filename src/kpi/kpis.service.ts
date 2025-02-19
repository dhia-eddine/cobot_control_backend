import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kpi } from './kpi.entity';
import { Cobot } from '../cobots/cobot.entity';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(Kpi)
    private readonly kpiRepository: Repository<Kpi>,
    @InjectRepository(Cobot)
    private readonly cobotRepository: Repository<Cobot>,
  ) {}

  /**
   * Generate a random KPI for a given Cobot and save it to the database.
   */
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

    const randomSeconds = Math.floor(Math.random() * 300); // up to 5 minutes
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
      (sum, kpi) => sum + kpi.quantityGlueUsed,
      0,
    );

    const totalOperatingTime = kpis.reduce(
      (sum, kpi) => sum + (kpi.endDate.getTime() - kpi.startDate.getTime()),
      0,
    );
    const totalSprayingTime = kpis.reduce(
      (sum, kpi) => sum + kpi.sprayingTime.getTime(),
      0,
    );

    const averageTimePerPiece = totalOperatingTime / numberOfProducedPieces;

    return {
      numberOfProducedPieces,
      totalQuantityGlue,
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
}
