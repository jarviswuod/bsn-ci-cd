import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../../../services/api';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../components/rating/rating';
import { PageResponseBorrowedBookResponse } from '../../../../services/models/page-response-borrowed-book-response';
import { FeedbackRequest } from '../../../../services/models/feedback-request';
import { BorrowedBookResponse } from '../../../../services/models/borrowed-book-response';
import { findAllReturnedBooks } from '../../../../services/fn/book/find-all-returned-books';
import { approveReturnedBorrowedBook } from '../../../../services/fn/book/approve-returned-borrowed-book';

@Component({
  selector: 'app-returned-books',
  imports: [FormsModule, Rating],
  templateUrl: './returned-books.html',
  styleUrl: './returned-books.scss',
})
export class ReturnedBooks implements OnInit {
  page: number = 0;
  size: number = 5;

  returnedBooks = signal<PageResponseBorrowedBookResponse>({});
  feedbackRequest: FeedbackRequest = { bookId: 0, comment: '', note: 0 };
  selectedBook = signal<BorrowedBookResponse | undefined>(undefined);

  message = signal('');
  level = signal('success');

  constructor(
    private router: Router,
    private api: Api,
  ) {}

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks(): void {
    this.api
      .invoke(findAllReturnedBooks, {
        page: this.page,
        size: this.size,
      })
      .then((res) => {
        this.returnedBooks.set(res);
      })
      .catch((err) => {});
  }

  approveBookReturned(book: BorrowedBookResponse): void {
    this.message.set('');

    if (!book.returned) {
      this.level.set('error');
      this.message.set('The book is not yet returned');
      return;
    }
    this.api
      .invoke(approveReturnedBorrowedBook, {
        bookId: book.id as number,
      })
      .then(() => {
        this.level.set('success');
        this.message.set('Book return approved successfully');
        this.findAllReturnedBooks();
      })
      .catch((err) => {
        this.level.set('error');
        this.message.set(err.error?.error ?? 'Could not approve book return');
      });
  }

  goToFirstPage(): void {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage(): void {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToPage(page: number): void {
    this.page = page;
    this.findAllReturnedBooks();
  }

  goToNextPage(): void {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage(): void {
    this.page = (this.returnedBooks().totalPages as number) - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == (this.returnedBooks().totalPages as number) - 1;
  }
}
