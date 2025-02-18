import { PartialType } from '@nestjs/mapped-types';
import { CreateTrajectoryDto } from './create-trajectory.dto';

export class UpdateTrajectoryDto extends PartialType(CreateTrajectoryDto) {}
