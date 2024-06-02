import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/schemas/expenses.enum';

export class CreateExpenseDto {
  @IsEnum(Category)
  category: Category;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
