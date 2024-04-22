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

  async login(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user || !(await checkPassword(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, id: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
