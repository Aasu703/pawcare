import { Book } from "../types/book.type";

let  books:Book[]=[
    {id:'0-1',name:"Aayush"},
    {id:'0-2',name:"Sujul"},
    {id:'0-3',name:"Potter",date:"2024-10-10"}
]

export interface IBookRepository {
    createBook(book: Book): Book;
    getBooks(): Book[];
    findBookById(id: string): Book | undefined;
}

export class BookRepository implements IBookRepository {
    createBook(book: Book): Book {
        books.push(book);
        return book;
    }
    getBooks(): Book[] {
        return books;
    }
    findBookById(id: string): Book | undefined {
        return books.find(book => book.id === id);
    }
}