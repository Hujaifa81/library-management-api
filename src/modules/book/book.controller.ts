import { Request, Response } from "express";
import { Book } from "./book.model";
import { createBookZodSchema, updateBookZodSchema } from "./book.zod.schema";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const createBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = await createBookZodSchema.parseAsync(req.body);
        const book = await Book.create(body);

        res.status(201).send({
            success: true,
            message: "Book created successfully",
            book
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
            error: error.message || error
        })
    }

};
export const getAllBooks = async (req: Request, res: Response): Promise<any> => {
    try {
        const filter = req.query.filter
        const sortBy = req.query.sortBy || 'createdAt'
        const sort = req.query.sort
        const limit = req.query.limit || 10

        const query: any = {};
        if (filter) {
            query.genre = filter;
        }
        const books = await Book.find(query)
            .sort([[sortBy as string, sort === 'desc' ? -1 : 1]])
            .limit(Number(limit));

        if (books.length===0) {
            return res.status(404).send({
                success: true,
                message: "Books not found",
                data: books
            })
        }
        res.status(200).send({
            success: true,
            message: "Books retrieved successfully",
            data: books
        })
    }
    catch (error: any) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve books",
        })

    }
}
export const getBookById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id)
        if (!book) {
            return res.status(404).send({
                success: true,
                message: `Book not found by this ${id}`,
                data: book
            })
        }
        res.send({
            success: true,
            message: "Book retrieved successfully",
            data: book
        })
    }
    catch (error: any) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve book",
        })

    }

}
export const updateBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.bookId;
        
        const body = await updateBookZodSchema.parseAsync(req.body);
        const book = await Book.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        })
        if (!book) {
            return res.status(404).send({
                success: false,
                message: "Book not found or not updated",
            });
        }

        res.status(200).send({
            success: true,
            message: "Book updated successfully",
            data: book
        })
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error,
            });
        }
        res.status(500).send({
            success: false,
            message: "Book not updated",
            error: (error as Error).message.includes('Validation failed') ? error : (error as Error).message
        });
    }

}
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            res.status(404).send({
                success: false,
                message: 'Book not found',
                data: null
            });
        }
        res.status(200).send({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error
        });
    }
};


