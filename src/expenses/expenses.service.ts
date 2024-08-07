import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expenses } from 'src/schemas/Expenses.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expenses.name) private readonly expensesModel: Model<Expenses>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    try {
      const newExpense = new this.expensesModel({
        ...createExpenseDto,
        createdBy: userId,
      });
      return await newExpense.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    const transactions = await this.expensesModel
      .find({ createdBy: userId })
      .exec();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome + totalExpense;
    const allIncomes = transactions.filter(
      (transaction) => transaction.amount > 0,
    );
    const allExpenses = transactions.filter(
      (transaction) => transaction.amount < 0,
    );

    return {
      allIncomes,
      allExpenses,
      transactions,
      totalIncome,
      totalExpense,
      balance,
    };
  }

  async findOne(id: string) {
    const expense = await this.expensesModel.findById(id);
    if (!expense) {
      throw new NotFoundException({ message: 'Expense not found' });
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
    const expense = await this.expensesModel.findById(id);
    if (!expense || expense.createdBy.toString() !== userId) {
      throw new NotFoundException({ message: 'Expense not found' });
    }
    // declare the properties that can be updated
    const { description, amount } = updateExpenseDto;
    Object.assign(expense, { description, amount });
    return await expense.save();
  }

  async delete(id: string, userId: string) {
    const result = await this.expensesModel.deleteOne({
      _id: id,
      createdBy: userId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException({
        message: 'Expense not found',
      });
    }
    return { message: 'Expense deleted successfully' };
  }
}
