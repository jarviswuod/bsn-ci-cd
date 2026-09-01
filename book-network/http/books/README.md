# Book API — IntelliJ HTTP Client Test Suite

Split by concern so each file is short enough to actually read while you work.
Every request has a `client.test(...)` block that asserts on the response —
run a file and you get pass/fail per request in IntelliJ's response panel,
not just a body to eyeball.

## Run order

1. **00-setup.http** — MUST run first, top to bottom. Authenticates 3 users
   and creates 9 books, capturing tokens/ids into `client.global` variables
   that every other file depends on.
2. After that, the rest can run in any order **except**:
   - `05-return-book.http` depends on the borrow created in `04-borrow-book.http`
   - `06-approve-return.http` depends on the return created in `05-return-book.http`
   - `10-cover-upload.http` needs a real image file path — edit the `< ./cover.jpg` line

Everything else (`02`, `03`, `07`, `08`, `09`) only depends on `00-setup.http`.

## Files

| File | Covers |
|---|---|
| `00-setup.http` | 3 user logins, 9 books created (3 per user) |
| `01-create-book.http` | `POST /books` — validation, auth, overwrite-by-id bug |
| `02-get-book-by-id.http` | `GET /books/{id}` — happy path, not found, bad type, privacy edge case |
| `03-list-books.http` | `GET /books`, `GET /books/owner` — pagination bug, empty results |
| `04-borrow-book.http` | `POST /books/borrow/{id}` — happy path + all rejection cases |
| `05-return-book.http` | `PATCH /books/borrow/return/{id}` — happy path + all rejection cases |
| `06-approve-return.http` | `PATCH /books/borrow/return/approve/{id}` — the two bug-check cases |
| `07-toggle-shareable.http` | `PATCH /books/shareable/{id}` — owner vs non-owner |
| `08-toggle-archived.http` | `PATCH /books/archived/{id}` — owner vs non-owner |
| `09-borrowed-returned-lists.http` | `GET /books/borrowed`, `GET /books/returned` |
| `10-cover-upload.http` | `POST /books/cover/{id}` — multipart, all edge cases |

## About the assertions

Framework-level responses (Spring Security 403 for no token, bean-validation
400s, path-variable type-mismatch 400s) are asserted with exact status codes —
those are Spring defaults and won't move.

Business-rule responses (`OperationNotPermittedException`,
`EntityNotFoundException`) don't have a visible `@ControllerAdvice` in the
code you shared, so I can't know for certain whether your handler maps them
to 400, 403, 404, or a raw 500. Those assertions check `status >= 400`
(i.e. "this must NOT succeed") and print the actual status/body to the
console so you can tighten the assertion to an exact code once you confirm
your handler's mapping. Search each file for `TIGHTEN ME` to find them fast.

## Known code issues these tests will surface (not test-file bugs — app bugs)

1. **Pagination**: `page` and `size` are both bound to `@RequestParam(name = "page")`
   in every list endpoint. `size` does nothing. See `03-list-books.http`.
2. **`approve/{bookId}` looks unreachable**: it 403s the owner immediately,
   but then queries by owner id — meaning neither owner nor borrower can
   successfully complete it. See `06-approve-return.http`.
3. **`GET /books/{id}` has no visibility restriction**: any authenticated
   user can fetch any book by id, including another user's non-shareable
   book. May or may not be intended — see `02-get-book-by-id.http`.
4. **Client-suppliable `id` on create**: `POST /books` accepts an `id` field;
   if it matches an existing book, JPA's `save()` will UPDATE instead of
   INSERT. See `01-create-book.http`.
5. **No re-borrow guard after return**: nothing stops the same book from
   being "returned" twice in a row. See `05-return-book.http`.
