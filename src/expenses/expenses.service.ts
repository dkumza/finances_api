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

  async allTransactions() {
    const transactions = await this.expensesModel.find().exec();

    let totalIncome = null;
    let totalExpense = null;
    let savings = null;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) totalIncome += transaction.amount;
      if (transaction.amount < 0 && transaction.category !== 'Savings')
        totalExpense += transaction.amount;
      if (transaction.category === 'Savings') savings += transaction.amount;
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
      balance,
      transactions,
      totalIncome,
      totalExpense,
      savings,
    };
  }

  async findOne(id: string) {
    console.log('id: ', id);
    const transactions = await this.expensesModel
      .find({ createdBy: id })
      .exec();
    console.log('transactions: ', transactions);

    let totalIncome = 0;
    let totalExpense = 0;
    let savings = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) totalIncome += transaction.amount;
      if (transaction.amount < 0 && transaction.category !== 'Savings')
        totalExpense += transaction.amount;
      if (transaction.category === 'Savings') savings += transaction.amount;
    });

    const balance = totalIncome + totalExpense;
    const allIncomes = transactions.filter(
      (transaction) => transaction.amount > 0,
    );
    const allExpenses = transactions.filter(
      (transaction) => transaction.amount < 0,
    );

    console.log('allIncomes: ', allIncomes);
    return {
      allIncomes,
      allExpenses,
      balance,
      transactions,
      totalIncome,
      totalExpense,
      savings,
    };
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
