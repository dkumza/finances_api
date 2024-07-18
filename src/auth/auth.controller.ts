import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { RequestWithUserID } from 'src/expenses/expenses.controller';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // POST to get token by checking email and password
  @Post()
  login(@Body() body: any) {
    return this.authService.token(body.email, body.password);
  }

  // GET to check if token is valid, also check if user exists in db
  @Get()
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: RequestWithUserID) {
    const user = req.user;
    const userId = user.id;
    // check if user exists in db
    const userFromDB = await this.usersService.getUserById(userId);
    if (!userFromDB) {
      throw new UnauthorizedException();
    }
    console.log('user: ', userId);
    return userId;
  }
}
