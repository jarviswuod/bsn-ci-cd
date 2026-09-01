import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedBookList } from './borrowed-book-list';

describe('BorrowedBookList', () => {
  let component: BorrowedBookList;
  let fixture: ComponentFixture<BorrowedBookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowedBookList],
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowedBookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
