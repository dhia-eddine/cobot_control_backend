import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateTrajectoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsObject()
  configuration: {
    x: number;
    y: number;
    z: number;
    roll: number;
    pitch: number;
    yaw: number;
  };
}
