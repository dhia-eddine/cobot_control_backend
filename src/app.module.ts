import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CobotsModule } from './cobots/cobots.module';
import { TrajectoriesModule } from './trajectories/trajectories.module';
import { KpiModule } from './kpi/kpis.module';
import { RobotTestConModule } from './robot-test-con/robot-test-con.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT, 10)
        : 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CobotsModule,
    TrajectoriesModule,
    KpiModule,
    RobotTestConModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
