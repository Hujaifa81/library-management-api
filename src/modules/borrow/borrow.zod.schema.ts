import mongoose from 'mongoose'
import z from 'zod'
export const createBorrowZodSchema=z.object({
    book:z.string().refine((val)=>mongoose.Types.ObjectId.isValid(val),{
        message:"Invalid ObjectId"
    }),
    quantity:z.number().int().positive(),
    dueDate:z.string().refine((val)=>!isNaN(Date.parse(val)),{
        message:"Invalid Date format"})
        .transform(val => new Date(val))
    
    
})