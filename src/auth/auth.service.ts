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
    console.log('user: ', user);
    if (!user || !(await checkPassword(pass, user.password))) {
      console.log('user @ auth.controller, password do not match?: ', user);

      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO - generate a JWT token and return it here
    console.log('result @auth.service: ', result);
    return result;
    // const payload = { username: user.username, sub: user.id };
    // return {
    //   ...result,
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
