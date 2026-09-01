import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { BookList } from './pages/book-list/book-list';
import { MyBooks } from './pages/my-books/my-books';
import { ManageBook } from './pages/manage-book/manage-book';
import { BorrowedBookList } from './pages/borrowed-book-list/borrowed-book-list';
import { ReturnedBooks } from './pages/returned-books/returned-books';

const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        component: BookList,
      },
      {
        path: 'my-books',
        component: MyBooks,
      },
      {
        path: 'manage',
        component: ManageBook,
      },
      {
        path: 'manage/:bookId',
        component: ManageBook,
      },
      {
        path: 'borrowed-books',
        component: BorrowedBookList,
      },
      {
        path: 'returned-books',
        component: ReturnedBooks,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
