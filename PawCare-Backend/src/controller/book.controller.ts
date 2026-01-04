import {Request,Response} from "express"
import {z} from "zod" // zod is used for validation of data
import { CreatBookDTO } from "../dtos/book.dto";
import { Book } from "../types/book.type";
import { BookService } from "../services/book.service";


const books: Book[] = [];

export class BookController {
    getbooks(req: Request, res: Response) {
        try {
            res.status(200).json({
                success: true,
                data: books
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching books'
            });
        }
    }

    getBookById(req: Request, res: Response) {
        const { bookid } = req.params;
        const book = books.find(b => b.id === bookid);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: book
        });
    }
}