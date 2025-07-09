import { Router } from "express";
import { borrowedBookSummary, createBorrowBook } from "./borrow.controller";

export const borrowRoutes=Router()
borrowRoutes.post('/',createBorrowBook)
borrowRoutes.get('/',borrowedBookSummary)