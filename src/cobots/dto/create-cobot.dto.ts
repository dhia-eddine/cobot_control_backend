import { IsNotEmpty, IsString, IsIP } from 'class-validator';

export class CreateCobotDto {
  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsIP()
  ipAddress: string;
}
