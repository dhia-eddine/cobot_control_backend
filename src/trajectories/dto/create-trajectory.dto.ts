import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ConfigurationDto {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;

  @IsNotEmpty()
  z: number;

  @IsNotEmpty()
  roll: number;

  @IsNotEmpty()
  pitch: number;

  @IsNotEmpty()
  yaw: number;
}

export class CreateTrajectoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConfigurationDto)
  configuration: ConfigurationDto[];
}
