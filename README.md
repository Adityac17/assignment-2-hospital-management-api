# Hospital Management API

Node.js + Express + MongoDB (Mongoose) backend. Bcrypt password hashing, passport-local session auth.

## Setup

```bash
npm install
```

Ensure MongoDB is running locally (or set `MONGO_URI` in `.env`).

```bash
npm start      # production
npm run dev    # nodemon (auto-reload)
```

Server: `http://localhost:3000`

## Project structure

```
config/       passport strategy
controllers/  request handlers (auth, hospital)
middleware/   logger, auth guard
models/       User, Hospital (Mongoose)
routes/       authRoutes, hospitalRoutes
server.js     app entry
```

## Endpoints

| Method | Path                  | Auth | Description                     |
|--------|-----------------------|------|---------------------------------|
| GET    | /                     | No   | Welcome message                 |
| POST   | /register             | No   | Register user                   |
| POST   | /login                | No   | Login (passport-local)          |
| POST   | /logout               | No   | Logout                          |
| GET    | /hospitals            | No   | List all hospitals              |
| GET    | /hospitals/available  | No   | Hospitals with available beds   |
| GET    | /hospitals/:id        | No   | Hospital by ID                  |
| POST   | /hospitals            | Yes  | Create hospital                 |
| PUT    | /hospitals/:id        | Yes  | Update hospital                 |
| DELETE | /hospitals/:id        | Yes  | Delete hospital                 |

## Auth notes

Session-based (cookie). In Postman enable cookie jar. Flow:

1. `POST /register` with `{ "username", "email", "password" }`
2. `POST /login` with `{ "username", "password" }` → sets session cookie
3. Protected `POST/PUT/DELETE /hospitals` reuse the cookie automatically.

## Sample bodies

Register:
```json
{ "username": "drjohn", "email": "john@x.com", "password": "secret123" }
```

Create hospital:
```json
{ "name": "City Care", "city": "Pune", "totalBeds": 100, "availableBeds": 40 }
```

## Status codes

`200` OK · `201` Created · `400` Bad request/validation · `401` Unauthorized · `404` Not found · `500` Server error
