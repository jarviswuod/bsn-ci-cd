import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookRequest } from '../../../../services/models/book-request';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../../services/api';
import { saveBook } from '../../../../services/fn/book/save-book';
import { uploadBookCoverPicture } from '../../../../services/fn/book/upload-book-cover-picture';
import { findBookById } from '../../../../services/fn/book/find-book-by-id';
import { BookResponse } from '../../../../services/models/book-response';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
})
export class ManageBook implements OnInit {
  errorMsg = signal<Array<string>>([]);
  selectedBookCover: any;
  selectedPicture = signal<string | undefined>(undefined);
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: '',
  };

  constructor(
    private router: Router,
    private api: Api,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      this.api
        .invoke(findBookById, { bookId: bookId })
        .then((book: BookResponse) => {
          this.bookRequest = {
            id: book.id,
            title: book.title as string,
            authorName: book.authorName as string,
            isbn: book.isbn as string,
            synopsis: book.synopsis as string,
            shareable: book.shareable,
          };
          if (book.cover) {
            this.selectedPicture.set('data:image/jpg;base64,' + book.cover);
          }
        })
        .catch((err) => {
          if (err.error?.validationErrors) {
            this.errorMsg.set(err.error.validationErrors);
          } else {
            this.errorMsg.set([err.error?.error ?? 'Could not save the book']);
          }
        });
    }
  }

  onFileSelected(selectedImg: Event): void {
    const input = selectedImg.target as HTMLInputElement;
    this.selectedBookCover = input.files?.[0];

    if (this.selectedBookCover) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook(): void {
    this.errorMsg.set([]);
    this.api
      .invoke(saveBook, { body: this.bookRequest })
      .then((bookId) => {
        this.api
          .invoke(uploadBookCoverPicture, {
            bookId: bookId,
            body: {
              file: this.selectedBookCover,
            },
          })
          .then(() => {
            this.router.navigate(['/books/my-books']);
          });
      })
      .catch((err) => {
        if (err.error?.validationErrors) {
          this.errorMsg.set(err.error.validationErrors);
        } else {
          this.errorMsg.set([err.error?.error ?? 'Could not save the book']);
        }
      });
  }
}
