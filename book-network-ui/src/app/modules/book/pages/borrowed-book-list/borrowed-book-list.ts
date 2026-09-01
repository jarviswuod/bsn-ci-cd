import { Component, OnInit, signal } from '@angular/core';
import { PageResponseBorrowedBookResponse } from '../../../../services/models/page-response-borrowed-book-response';
import { BorrowedBookResponse } from '../../../../services/models/borrowed-book-response';
import { Router } from '@angular/router';
import { Api } from '../../../../services/api';
import { findAllBorrowedBooks } from '../../../../services/fn/book/find-all-borrowed-books';
import { FeedbackRequest } from '../../../../services/models/feedback-request';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../components/rating/rating';
import { returnedBorrowedBook } from '../../../../services/fn/book/returned-borrowed-book';
import { saveFeedback } from '../../../../services/fn/feedback/save-feedback';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [FormsModule, Rating],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss',
})
export class BorrowedBookList implements OnInit {
  page: number = 0;
  size: number = 5;

  borrowedBooks = signal<PageResponseBorrowedBookResponse>({});
  feedbackRequest: FeedbackRequest = { bookId: 0, comment: '', note: 0 };
  selectedBook = signal<BorrowedBookResponse | undefined>(undefined);

  constructor(
    private router: Router,
    private api: Api,
  ) {}

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  returnedBorrowedBook(book: BorrowedBookResponse): void {
    this.selectedBook.set(book);
    this.feedbackRequest = { bookId: book.id as number, comment: '', note: 0 };
  }

  returnBook(withFeedback: boolean): void {
    this.api
      .invoke(returnedBorrowedBook, {
        bookId: this.selectedBook()?.id as number,
      })
      .then(() => {
        if (withFeedback) {
          this.giveFeedback();
        }
        this.selectedBook.set(undefined);
        this.findAllBorrowedBooks();
      });
  }

  private giveFeedback(): void {
    this.api
      .invoke(saveFeedback, {
        body: this.feedbackRequest,
      })
      .then(() => {});
  }

  private findAllBorrowedBooks(): void {
    this.api
      .invoke(findAllBorrowedBooks, {
        page: this.page,
        size: this.size,
      })
      .then((res) => {
        this.borrowedBooks.set(res);
      })
      .catch((err) => {});
  }

  goToFirstPage(): void {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage(): void {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToPage(page: number): void {
    this.page = page;
    this.findAllBorrowedBooks();
  }

  goToNextPage(): void {
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToLastPage(): void {
    this.page = (this.borrowedBooks().totalPages as number) - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page == (this.borrowedBooks().totalPages as number) - 1;
  }
}
