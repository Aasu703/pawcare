//business layer
import { CreateBookDTO } from "../dtos/book.dto";
import {Book} from "../types/book.type"
import { IBookRepository,BookRepository } from "../repositories/book.repository";
import { response } from "express";


let bookRepository:IBookRepository = new BookRepository();

export class BookService{
    createBook(book: CreateBookDTO) {
        // business logic
        const exist = bookRepository.findBookById(book.id);
        if (exist){
            throw new Error("Book ID already exists");
        }
        const newBook:Book={
            id:book.id,
            name:book.name
        };
        let created:Book=bookRepository.createBook(newBook);
        //transform data if needed
        return created;
    }

    getAllbooks(): Book[]{
        // transform data/business logic
        let response:Book[] = bookRepository
        .getBooks()
        .map(
            (book) => ({
                ...book,
                name: book.name.toUpperCase()
            })
        );
        return response;
    }

    
}

export default BookService;