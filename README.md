# Development Platforms CA

A REST API built with Express.js, TypeScript and MySQL for the Development Platforms course assignment.

The API allows users to register and log in, browse articles publicly, and create articles when authenticated with a JWT.



## Technologies

- Node.js
- Express.js
- TypeScript
- MySQL
- mysql2
- bcrypt
- JSON Web Token (JWT)
- dotenv



## Project Structure

```text
src/
├── config/
│   └── db.ts
├── controllers/
│   ├── articleController.ts
│   └── authController.ts
├── middleware/
│   ├── authMiddleware.ts
│   └── errorMiddleware.ts
├── routes/
│   ├── articleRoutes.ts
│   └── authRoutes.ts
├── types/
│   └── express.d.ts
├── app.ts
└── server.ts


database/
└── schema.sql
```



## Installation and Setup


### 1. Clone the repository

```bash
git clone https://github.com/barumski/development-platforms-ca.git
cd development-platforms-ca
```


### 2. Install dependencies

```bash
npm install
```


### 3. Configure environment variables

Copy `.env.example` and create a new file named `.env`.

Add your own database password and JWT secret:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=dev_platforms_app
DB_PASSWORD=your_database_password
DB_NAME=development_platforms_ca
JWT_SECRET=your_jwt_secret
```

The `.env` file ios ignored by Git and should not be committed.


### 4. Set up the database

Make sure MySQL is running, then run the SQL script located at:

```text
database/schema.sql
```

This creates the `development_platforms_ca` database and the required `users` and `articles` tables.

The database user configured in `.env` must have permission to read from and insert into the database.


### 5. Start the development server

```bash
npm run dev
```

The API will run by default at:

```text
http://localhost:3000
```


### 6. Build and run for production

```bash
npm run build
npm start
```



## API Endpoints


### Register a user

```http
POST /auth/register
```

Request body:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Returns `201 Created` when registration is successful.


### Log in 

```http
POST /auth/login
```

Request body:

```json
{
    "email":"user@example.com",
    "password": "password123"
}
```

Returns `200 OK` with a JWT when the credentials are valid.


### Get all articles

```http
GET /articles
```

This endpoint is public and does not require authentication.

Returns `200 OK` with an array of articles.


### Crate an article

```http
POST /articles
```

The endpoint requires a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

Request body:

```json
{
    "title": "My article",
    "body": "Article content",
    "category": "Technology"
}
```

The authenticated user's ID is taken from the JWT and stored as `submitted_by`.

Returns `201 Created` when the article is successfully created.



## Error Responses

The API return JSOn error messages with appropriate HTTP status codes.


| Status | Meaning |
| --- | --- |
| `400 Bad Request` | Missing or invalid input |
| `401 Unauthorized` | Invalid credentials or missing/invalid JWT |
| `404 Not Found` | Requested route does not exist |
| `409 Conflict` | Email is already registered |
| `500 Internal Server Error` | Unexpected server or database error |

Example:

```json
{
    "message": "Invalid email or password"
}



## Security 

- Passwords are hashed with bcrypt before being stored in the database.
- Authentication is handled using JSON Web Tokens (JWT).
- Protected routes require a valid JWT using the Bearer authentication scheme.
- The authenticated user ID is retrieved from the verified JWT rather than from client input.
- SQL queries use parameterized values to reduce the risk of SQL injection.
- Sensitive configuration such as database passwords and JWT secrets is stored in environment variables and excluded from Git.