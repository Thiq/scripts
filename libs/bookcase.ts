import * as ender from 'ender-chest';
import * as guid from 'guid';
const table = ender.get('bookcases');

class Bookcase {
    position;
    books: {};

    constructor(position) {
        this.position = position;
    }

    addBook(book: BookcaseBook) {
        this.books[book.id] = book;
    }

    removeBook(id: string) {
        delete(this.books[id]);
        this.books[id] = undefined;
    }

    getBook(id: string) {
        return this.books[id];
    }

    getBooks() {
        var result = [];
        for (var book in this.books) {
            if (this.books.hasOwnProperty(book)) result.push(this.books[book]);
        }

        return result;
    }
}

class BookcaseBook {
    author: string;
    pages: string[];
    title: string;
    id: string;

    constructor(author, pages, title) {
        this.author = author;
        this.pages = pages;
        this.title = title;
        this.id = guid().toString();
    }
}