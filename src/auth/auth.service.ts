import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    role?: UserRole,
  ): Promise<User> {
    const userRole = role ?? UserRole.OPERATOR;

    return this.usersService.createUser(authCredentialsDto, userRole);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { email, password } = signInCredentialsDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken };
  }

  async logOut(): Promise<void> {
    // Implement logout logic if needed, for example, invalidating JWT tokens
  }
}
