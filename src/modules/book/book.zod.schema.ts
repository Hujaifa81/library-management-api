import z from "zod";

export const createBookZodSchema=z.object({
    title:z.string(),
    author:z.string(),
    genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn:z.string(),
    description:z.string().optional(),
    copies:z.number(),
    available:z.boolean().default(true)
})
export const updateBookZodSchema=z.object({
    title:z.string().optional(),
    author:z.string().optional(),
    genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]).optional(),
    isbn:z.string().optional(),
    description:z.string().optional(),
    copies:z.number().optional(),
    available:z.boolean().optional()
})