import { model, Schema } from "mongoose";
import { BorrowStaticMethod, IBorrow } from "./borrow.interface";
import { Book } from "../book/book.model";

const borrowSchema=new Schema<IBorrow,BorrowStaticMethod>({
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:[true,'Book ID is required'],
    },
    quantity:{
        type:Number,
        required:[true,'Quantity is required'],
        min:[1,'Quantity must be more than 0'],
        validate:{
            validator:Number.isInteger,
            message:'Quantity must be a whole number'
        }
    },
    dueDate:{
        type:Date,
        required:[true,'Due date is required']
    }
},
{
    versionKey:false,
    timestamps:true
})
borrowSchema.static('deductRequestedQuantity',async function deductRequestedQuantity(bookId:string,borrowedQuantity:number) {
  const requestedBook=await Book.findById(bookId)
  if (!requestedBook) {
    return { updated: false, message: 'Book not found.' };
  }

  if (requestedBook.copies < borrowedQuantity) {
    return { updated: false, message: 'Not enough copies to borrow.' };
  }
  if(requestedBook){
    if(requestedBook.copies>=borrowedQuantity){
        requestedBook.copies=requestedBook.copies-borrowedQuantity
    }
   
    if(requestedBook.copies===0){
        requestedBook.available=false
    }
  }
  const updatedFiled={
    copies: requestedBook?.copies,
    available:requestedBook?.available
  }
  await Book.findByIdAndUpdate(bookId,updatedFiled,{new:true,runValidators:true})
  return {
    message:'Book borrowed successfully',
    updated: true,
    copies: requestedBook.copies,
    available: requestedBook.available
  };
})
export const Borrow=model<IBorrow,BorrowStaticMethod>('Borrow',borrowSchema)