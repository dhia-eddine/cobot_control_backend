import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.usersService.findOne(parsedId);
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get('check-email')
  async checkEmail(
    @Query('email') email: string,
  ): Promise<{ exists: boolean }> {
    if (!email) throw new BadRequestException('Email query param required');
    const exists = await this.usersService.checkEmailExists(email);
    return { exists };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid user ID');
    }
    await this.usersService.remove(parsedId);
    return { message: 'User deleted successfully' };
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
  ): Promise<User> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.usersService.update(parsedId, updateUserDto);
  }

  @Post(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.usersService.updateRole(parsedId, role);
  }
}
