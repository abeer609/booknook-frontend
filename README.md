# BookNook – A Small Online Library

Live Site: https://booknook.example.com

BookNook is a small online library where users can browse, add, borrow, and return books.

## Features

- Browse all books with search and category filtering.
- Add new books with details and total copies.
- Borrow a book for 7 days and return it anytime.
- View your borrowed books and track return dates.
- Manage your own books with edit and delete support.
- Authentication with email/password and Google OAuth.
- Admin dashboard for managing books and borrows.

## API Endpoints

Base URL: `http://localhost:8000`

Books:
- `GET /books` — get all books (public)
- `GET /books/:id` — get one book
- `POST /books` — add a book (protected)
- `PATCH /books/:id` — update a book (protected)
- `DELETE /books/:id` — delete a book (protected)

Borrows:
- `GET /borrows` — get borrows (optional `?borrowerEmail=`)
- `POST /borrows` — borrow a book (protected)
- `DELETE /borrows/:id` — return a book (protected)`