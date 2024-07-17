import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Category } from 'src/schemas/expenses.enum';
import { UsersService } from 'src/users/users.service';

export interface RequestWithUserID extends Request {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('categories')
  getCategories() {
    return Category;
  }

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() request: RequestWithUserID,
  ) {
    const userId = request.user.id;

    // check if user exists in db
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('createExpenseDto: ', createExpenseDto);

    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get() // get all expenses by user id
  findAllByUser(@Req() request: RequestWithUserID) {
    const userId = request.user.id;
    console.log('User ID from JWT: ', userId);
    return this.expensesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() request: RequestWithUserID,
  ) {
    const userId = request.user.id;
    return this.expensesService.update(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() request: RequestWithUserID) {
    const userId = request.user.id;
    return this.expensesService.delete(id, userId);
  }
}
