import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../../../services/api';
import { findAllBooks } from '../../../../services/fn/book/find-all-books';
import { PageResponseBookResponse } from '../../../../services/models/page-response-book-response';
import { BookCard } from '../../components/book-card/book-card';
import { BookResponse } from '../../../../services/models/book-response';
import { borrowedBook } from '../../../../services/fn/book/borrowed-book';

@Component({
  selector: 'app-book-list',
  imports: [BookCard],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  page: number = 0;
  size: number = 5;
  bookResponse = signal<PageResponseBookResponse>({});

  message = signal('');
  level = signal('success');

  constructor(
    private router: Router,
    private api: Api,
  ) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks(): void {
    this.api
      .invoke(findAllBooks, {
        page: this.page,
        size: this.size,
      })
      .then((books) => {
        this.bookResponse.set(books);
      })
      .catch((err) => {});
  }

  borrowBook(book: BookResponse): void {
    this.message.set('');
    this.api
      .invoke(borrowedBook, { bookId: book.id as number })
      .then(() => {
        this.level.set('success');
        this.message.set('Book successfully added to your list');
      })
      .catch((err) => {
        this.level.set('error');
        this.message.set(err.error?.error ?? 'Could not borrow this book');
      });
  }
  goToFirstPage(): void {
    this.page = 0;
    this.findAllBooks();
  }

  goToPreviousPage(): void {
    this.page--;
    this.findAllBooks();
  }

  goToPage(page: number): void {
    this.page = page;
    this.findAllBooks();
  }

  goToNextPage(): void {
    this.page++;
    this.findAllBooks();
  }

  goToLastPage(): void {
    this.page = (this.bookResponse().totalPages as number) - 1;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page == (this.bookResponse().totalPages as number) - 1;
  }
}
