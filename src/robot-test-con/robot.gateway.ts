import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RobotTestConService } from './robot-test-con.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RobotGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('RobotGateway');

  @WebSocketServer() server: Server;

  constructor(private RobotTestConService: RobotTestConService) {}

  afterInit(server: Server) {
    this.logger.log('Robot Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Command to move the robot
  @SubscribeMessage('moveRobot')
  handleMoveRobot(client: Socket, payload: any): void {
    this.logger.log(`Move Robot Command: ${JSON.stringify(payload)}`);
    this.RobotTestConService.moveRobot(payload);
    client.emit('robotStatus', { status: 'moving', payload });
  }

  // Command to get robot status
  @SubscribeMessage('getRobotStatus')
  handleGetRobotStatus(client: Socket): void {
    this.logger.log('Get Robot Status Command');
    const status = this.RobotTestConService.getRobotStatus();
    client.emit('robotStatus', status);
  }

  // Command to execute a trajectory
  @SubscribeMessage('executeTrajectory')
  handleExecuteTrajectory(
    client: Socket,
    payload: { trajectoryId: number },
  ): void {
    this.logger.log(`Execute Trajectory Command: ${payload.trajectoryId}`);
    this.RobotTestConService.executeTrajectory(payload.trajectoryId);
    client.emit('robotStatus', {
      status: 'executing_trajectory',
      trajectoryId: payload.trajectoryId,
    });
  }

  // Update robot status - can be called from the service when receiving updates
  // from the Python client
  updateRobotStatus(status: any): void {
    this.server.emit('robotStatus', status);
  }
}
