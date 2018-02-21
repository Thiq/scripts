import * as ender from 'ender-chest';
import * as guid from 'guid';
import * as _ from 'underscore';
import * as InventoryAction from '@org.bukkit.event.inventory.InventoryAction';
import * as ClickType from '@org.bukkit.event.inventory.ClickType';
const table = ender.getTable('bookcases');
const registeredBookcases = table.get('bookcases') || {};
const books = table.get('books');
const openedBookcases = {};

class Bookcase {
    position;
    books: string[] = [];

    constructor(position) {
        this.position = position;
        registeredBookcases[position.toString()] = this;
    }

    addBook(itemStack) {
        var book = BookcaseBook.fromItemStack(itemStack);
        this.books.push(book.title);
        book.save();
    }

    removeBook(title: string) {
        var indexOf = this.books.indexOf(title);
        if (indexOf > -1) this.books[indexOf] = undefined;
    }

    getBook(title: string) {
        return this.books[title];
    }

    getBooks(): BookcaseBook[] {
        return this.books.map(BookcaseBook.get);
    }

    containsBook(title: string): boolean {
        return this.books.indexOf(title) > -1;
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

    createInventory() {
        let window = Bukkit.createInventory(null, 9, 'Bookcase');
        let books = this.getBooks();
        window.addItem(books.map(b => b.toItemStack()));
        return window;
    }
}

class BookcaseBook {
    author: string;
    pages: string[];
    title: string;

    constructor(author, pages, title) {
        this.author = author;
        this.pages = pages;
        this.title = title;
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
        var index = _.findIndexOf(books, { title: this.title });
        if (index == -1) books.push(this);
        else books[index] = this;
        table.save();
    }

    static get(title): BookcaseBook {
        var found = _.findIndexOf(books, { title: title });
        if (found == -1) return undefined;
        var book = books[found];
        var result = new BookcaseBook(book.author, book.pages, book.title);
        result.title = title;
        return result;
    }
}

eventHandler('player', 'interact', (e) => {
    let clickedBlock = e.getClickedBlock();
    if (e.getAction() != InventoryAction.RIGHT_CLICK_BLOCK) return;
    if (clickedBlock.getType() != org.bukkit.Material.BOOKSHELF) return;
    var position = clickedBlock.location;
    var bookcase = Bookcase.get(position);
    if (!bookcase) {
        bookcase = new Bookcase(position);
        bookcase.save();
    }
    e.player.openInventory(bookcase.createInventory());
    openedBookcases[e.player.getUniqueId()] = position;
});

eventHandler('inventory', 'close', (e) => {
    openedBookcases[e.player.getUniqueId()] = undefined;
});

eventHandler('inventory', 'moveItem', (e) => {
    let player = e.getWhoClicked();
    let bookcase = openedBookcases[player.getUniqueId()] as Bookcase;
    if (!bookcase) return;
    var source = e.getSource();
    var target = e.getDestination();
    var isAdding = target.getName() == 'Bookcase'; // if we're adding or removing from the bookcase
    if (isAdding) {
        if (e.getItem().getType() != org.bukkit.Material.BOOK) return;
        bookcase.addBook(e.getItem());
    } else {
        bookcase.removeBook(e.getItem().getItemMeta().getTitle());
    }
});