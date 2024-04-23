import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // https://docs.nestjs.com/security/authentication#jwt-token
import { UsersService } from 'src/users/users.service';
import { checkPassword } from 'src/utils/pswUtils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    console.log('user: ', user);
    if (!user || !(await checkPassword(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
