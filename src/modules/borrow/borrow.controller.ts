import { Request, Response } from "express";
import { createBorrowZodSchema } from "./borrow.zod.schema";
import { Borrow } from "./borrow.model";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const createBorrowBook = async (req: Request, res: Response):Promise<any> => {
  try {
    const body = await createBorrowZodSchema.parseAsync(req.body);

    const deductionResult = await Borrow.deductRequestedQuantity(body.book, body.quantity);

    if (!deductionResult.updated) {
      return res.status(400).send({
        success: false,
        message: deductionResult.message || "Failed to borrow book",
        error: deductionResult
      });
    }

    const borrowedBook = await Borrow.create(body);

    return res.status(201).send({
      success: true,
      message: "Book borrowed successfully",
      data: borrowedBook
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({
        message: "Validation failed",
        success: false,
        error: error
      });
    }
    if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
  }
    res.status(500).send({
      message: "Validation failed",
      success: false,
      error: error
    })
  }
};
export const borrowedBookSummary = async (req: Request, res: Response): Promise<any> => {
  try {
    const bookSummary = await Borrow.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book_details'
        }
      },
      {
        $unwind: '$book_details'
      },
      {
        $group: { _id: "$book_details.isbn", totalQuantity: { $sum: "$quantity" }, title: { $first: "$book_details.title" } }
      },
      {
        $project: {
          totalQuantity: 1,
          book: {
            title: '$title',
            isbn: '$_id'
          }
        }
      }
    ])
    if (!bookSummary) {
     return res.status(404).send({
        success: false,
        message: "Borrow book summary not found",
        error: "No borrow book summary"
      })
    }
      res.status(200).send({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: bookSummary
    })
  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve Borrowed books summary",

    })
  }
}
