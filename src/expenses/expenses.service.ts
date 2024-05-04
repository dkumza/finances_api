import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newExpense = new this.expensesModel({
      ...createExpenseDto,
      createdBy: userId,
    });
    return await newExpense.save();
  }

  async findAll(userId: string) {
    return this.expensesModel.find({ createdBy: userId }).populate('createdBy');
  }

  async findOne(id: string) {
    const expense = await this.expensesModel.findById(id);
    if (!expense) {
      throw new NotFoundException({ message: 'Expense not found' });
    }
    return expense;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
