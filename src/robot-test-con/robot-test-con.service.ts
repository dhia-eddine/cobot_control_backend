import { Injectable } from '@nestjs/common';
import * as net from 'net';
import { Trajectory } from '../trajectories/trajectory.entity';
import { Cobot } from '../cobots/cobot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

@Injectable()
export class RobotTestConService {
  private logger: Logger = new Logger('RobotService');
  private pythonClient: Socket | null = null;
  private robotStatus: any = { online: false, status: 'offline' };

  constructor(
    @InjectRepository(Trajectory)
    private trajectoryRepository: Repository<Trajectory>,
    @InjectRepository(Cobot)
    private cobotRepository: Repository<Cobot>,
  ) {}

  // Connect to Python Socket.IO client
  connectToPythonClient(url: string = 'http://localhost:5000'): void {
    this.logger.log(`Connecting to Python client at ${url}`);

    // Disconnect existing connection if it exists
    if (this.pythonClient) {
      this.pythonClient.disconnect();
    }

    // Connect to Python Socket.IO server
    this.pythonClient = io(url);

    // Listen for connection events
    this.pythonClient.on('connect', () => {
      this.logger.log('Connected to Python client');
    });

    // Listen for disconnection events
    this.pythonClient.on('disconnect', () => {
      this.logger.log('Disconnected from Python client');
      this.robotStatus = { online: false, status: 'offline' };
    });

    // Listen for status updates from the robot
    this.pythonClient.on('robotStatusUpdate', (status) => {
      this.logger.log(
        `Received status update from robot: ${JSON.stringify(status)}`,
      );
      this.robotStatus = status;
    });
  }

  // Move robot to specific position
  moveRobot(payload: any): void {
    if (!this.pythonClient?.connected) {
      this.logger.error('Python client not connected');
      return;
    }

    this.logger.log(`Sending moveRobot command: ${JSON.stringify(payload)}`);
    this.pythonClient.emit('moveRobot', payload);
  }

  // Get current robot status
  getRobotStatus(): any {
    return this.robotStatus;
  }

  // Execute a saved trajectory
  async executeTrajectory(trajectoryId: number): Promise<void> {
    // Find the trajectory in the database
    const trajectory = await this.trajectoryRepository.findOne({
      where: { id: trajectoryId },
      relations: ['cobot'],
    });

    if (!trajectory) {
      this.logger.error(`Trajectory with ID ${trajectoryId} not found`);
      return;
    }

    // Send trajectory data to Python client
    if (this.pythonClient?.connected) {
      this.logger.log(`Executing trajectory ${trajectoryId}`);
      this.pythonClient.emit('executeTrajectory', {
        configuration: trajectory.configuration,
        cobotIp: trajectory.cobot.ipAddress,
      });
    } else {
      this.logger.error('Python client not connected');
    }
  }

  // Update cobot status in database
  async updateCobotStatus(
    reference: string,
    status: string,
    online: boolean,
  ): Promise<void> {
    try {
      await this.cobotRepository.update({ reference }, { status, online });
      this.logger.log(
        `Updated cobot ${reference} status: ${status}, online: ${online}`,
      );
    } catch (error) {
      this.logger.error(`Failed to update cobot status: ${error.message}`);
    }
  }
}
