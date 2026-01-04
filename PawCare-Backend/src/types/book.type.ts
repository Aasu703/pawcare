import {z} from "zod" // zod is used for validation of data

export const BookSchema = z.object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required"),
    date: z.string().optional()
});
export type Book = z.infer<typeof BookSchema>;