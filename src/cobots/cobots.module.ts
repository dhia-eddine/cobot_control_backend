import { Module } from '@nestjs/common';
import { CobotsController } from './cobots.controller';
import { CobotsService } from './cobots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobot } from './cobot.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cobot]), UsersModule],

  controllers: [CobotsController],
  providers: [CobotsService],
})
export class CobotsModule {}
