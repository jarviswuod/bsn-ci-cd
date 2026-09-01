import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../../../services/api';
import { PageResponseBookResponse } from '../../../../services/models/page-response-book-response';
import { BookCard } from '../../components/book-card/book-card';
import { BookResponse } from '../../../../services/models/book-response';
import { findAllBooksByOwner } from '../../../../services/fn/book/find-all-books-by-owner';
import { updateShareableStatus } from '../../../../services/fn/book/update-shareable-status';
import { updateArchivedStatus } from '../../../../services/fn/book/update-archived-status';

@Component({
  selector: 'app-my-books',
  imports: [BookCard, RouterLink],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
})
export class MyBooks implements OnInit {
  page: number = 0;
  size: number = 5;
  bookResponse = signal<PageResponseBookResponse>({});

  constructor(
    private router: Router,
    private api: Api,
  ) {}

  ngOnInit(): void {
    this.findAllBooksByOwner();
  }

  private findAllBooksByOwner(): void {
    this.api
      .invoke(findAllBooksByOwner, {
        page: this.page,
        size: this.size,
      })
      .then((books) => {
        this.bookResponse.set(books);
      })
      .catch((err) => {});
  }

  archiveBook(book: BookResponse): void {
    this.api
      .invoke(updateArchivedStatus, {
        bookId: book.id as number,
      })
      .then(() => {
        book.archived = !book.archived;
      });
  }

  shareBook(book: BookResponse): void {
    this.api
      .invoke(updateShareableStatus, {
        bookId: book.id as number,
      })
      .then(() => {
        book.shareable = !book.shareable;
      });
  }

  editBook(book: BookResponse): void {
    this.router.navigate(['books', 'manage', book.id]);
  }

  goToFirstPage(): void {
    this.page = 0;
    this.findAllBooksByOwner();
  }

  goToPreviousPage(): void {
    this.page--;
    this.findAllBooksByOwner();
  }

  goToPage(page: number): void {
    this.page = page;
    this.findAllBooksByOwner();
  }

  goToNextPage(): void {
    this.page++;
    this.findAllBooksByOwner();
  }

  goToLastPage(): void {
    this.page = (this.bookResponse().totalPages as number) - 1;
    this.findAllBooksByOwner();
  }

  get isLastPage(): boolean {
    return this.page == (this.bookResponse().totalPages as number) - 1;
  }
}
