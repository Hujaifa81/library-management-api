import { Model, Types } from "mongoose";

export interface IBorrow{
    book:Types.ObjectId,
    quantity:number,
    dueDate:Date
}
export interface BorrowStaticMethod extends Model<IBorrow> {
  deductRequestedQuantity(bookId: string, borrowedQuantity: number): Promise<{
    updated: boolean;
    copies?: number;
    available?: boolean;
    message?: string;
  }>;
}
