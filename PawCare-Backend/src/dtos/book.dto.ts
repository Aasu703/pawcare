import z from "zod";
import { BookSchema } from "../types/book.type";

export const CreatBookDTO = BookSchema.pick({id:true, name:true});
export type CreateBookDTO = z.infer<typeof CreatBookDTO>;   
