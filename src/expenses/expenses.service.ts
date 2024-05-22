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
    return this.expensesModel
      .find({ createdBy: userId })
      .populate('createdBy', '_id');
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
    const { title, description, amount } = updateExpenseDto;
    Object.assign(expense, { title, description, amount });
    return await expense.save();
  }

  async remove(id: string, userId: string) {
    const result = await this.expensesModel.deleteOne({
      _id: id,
      createdBy: userId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException({
        message: 'Expense not found',
      });
    }
    return { message: 'Expense removed successfully' };
  }
}
