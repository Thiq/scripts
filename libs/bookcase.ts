import * as ender from 'ender-chest';
import * as guid from 'guid';
import * as _ from 'underscore';
const table = ender.getTable('bookcases');
const registeredBookcases = table.get('bookcases');
const books = table.get('books');

class Bookcase {
    position;
    books: string[] = [];

    constructor(position) {
        this.position = position;
        registeredBookcases[position.toString()] = this;
    }

    addBook(itemStack) {
        var book = BookcaseBook.fromItemStack(itemStack);
        this.books.push(book.id);
        book.save();
    }

    removeBook(id: string) {
        var indexOf = this.books.indexOf(id);
        if (indexOf > -1) this.books[indexOf] = undefined;
    }

    getBook(id: string) {
        return this.books[id];
    }

    getBooks(): BookcaseBook[] {
        return this.books.map(BookcaseBook.get);
    }

    save() {
        registeredBookcases[this.position.toString()] = this;
        table.save();
    }

    static get(position): Bookcase {
        if (!registeredBookcases[position.toString()]) return undefined;
        var bookcase = registeredBookcases[position.toString()];
        var foundBooks = _.where(bookcase.books.map(BookcaseBook.get), (b) => b != undefined);
        var result = new Bookcase(position);
        result.books = foundBooks;
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

    toItemStack() {
        var stack = itemStack({
            type: org.bukkit.Material.BOOKSHELF
        });
    }

    static fromItemStack(book): BookcaseBook {
        return new BookcaseBook(book.getAuthor(), book.getPages(), book.getTitle());
    }

    save() {
        var index = _.findIndexOf(books, { id: this.id });
        if (index == -1) books.push(this);
        else books[index] = this;
        table.save();
    }

    static get(id): BookcaseBook {
        var found = _.findIndexOf(books, { id: id });
        if (found == -1) return undefined;
        var book = books[found];
        var result = new BookcaseBook(book.author, book.pages, book.title);
        result.id = id;
        return result;
    }
}

registerEvent(player, 'interact', (e) => {
    if (e.blockClicked.type != org.bukkit.Material.BOOKSHELF) return;
});