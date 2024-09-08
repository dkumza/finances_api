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
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

export interface RequestWithUserID extends Request {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly usersService: UsersService,
  ) {}

  // get all categories
  @Get('categories')
  @Roles(['user', 'admin'])
  getCategories() {
    return Category;
  }

  // create new expense
  @Post()
  @Roles(['user', 'admin'])
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
    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get() // get all expenses by user id
  @Roles(['admin'])
  transactions() {
    return this.expensesService.allTransactions();
  }

  @Get(':id')
  @Roles(['user', 'admin'])
  findOne(@Req() request: RequestWithUserID, @Param('id') id: string) {
    const userId = request.user.id;
    if (userId !== id) throw new UnauthorizedException();
    return this.expensesService.findOne(userId);
  }

  @Patch(':id')
  @Roles(['user', 'admin'])
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() request: RequestWithUserID,
  ) {
    const userId = request.user.id;
    return this.expensesService.update(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  @Roles(['user', 'admin'])
  delete(@Param('id') id: string, @Req() request: RequestWithUserID) {
    const userId = request.user.id;
    return this.expensesService.delete(id, userId);
  }
}
