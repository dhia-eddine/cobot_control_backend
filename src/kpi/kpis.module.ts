import { Module } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { KpisController } from './kpis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kpi } from './kpi.entity';
import { Cobot } from 'src/cobots/cobot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi, Cobot])],

  providers: [KpisService],
  controllers: [KpisController],
})
export class KpiModule {}
