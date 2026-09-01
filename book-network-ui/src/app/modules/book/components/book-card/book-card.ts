import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookResponse } from '../../../../services/models/book-response';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-book-card',
  imports: [Rating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  private _book: BookResponse = {};
  private _bookCover: string | undefined;
  _manage: boolean = false;

  get book(): BookResponse {
    return this._book;
  }

  @Input()
  set book(value: BookResponse) {
    this._book = value;
  }

  get bookCover(): string | undefined {
    if (this._bookCover) {
      return 'data:image/jpg;base64, ' + this.book.cover;
    }
    return 'https://picsum.photos/1900/800';
  }

  set bookCover(value: string | undefined) {
    this._bookCover = value;
  }

  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }

  @Output() public share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  onShowDetails(): void {
    this.details.emit(this.book);
  }

  onBorrow(): void {
    this.borrow.emit(this.book);
  }

  onAddToWaitingList(): void {
    this.addToWaitingList.emit(this.book);
  }

  onEdit(): void {
    this.edit.emit(this.book);
  }

  onShare(): void {
    this.share.emit(this.book);
  }

  onArchive(): void {
    this.archive.emit(this.book);
  }
}
