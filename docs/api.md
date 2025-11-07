# API Documentation

Base URL: `http://localhost:5000/api`

## Auth

POST `/auth/register`
- Body: `{ name: string, email: string, password: string }`
- 201 → `{ id, email, name }`
- 409 → `{ error: 'Email already registered' }`

POST `/auth/login`
- Body: `{ email: string, password: string }`
- 200 → `{ token, user: { id, email, name } }`
- 401 → `{ error: 'Invalid credentials' }`

POST `/auth/logout`
- 200 → `{ ok: true }`

## Profile (requires `Authorization: Bearer <token>`)

GET `/profile`
- 200 → `{ _id, email, name, createdAt, updatedAt }`

PUT `/profile`
- Body: `{ name?: string }`
- 200 → updated profile

## Tasks (requires `Authorization: Bearer <token>`)

GET `/tasks`
- Query: `q?`, `status?` in `['todo','in_progress','done']`
- 200 → `Task[]`

POST `/tasks`
- Body: `{ title: string, description?: string, status?: 'todo'|'in_progress'|'done' }`
- 201 → `Task`

PUT `/tasks/:id`
- Body: partial task fields
- 200 → updated `Task`
- 404 → `{ error: 'Task not found' }`

DELETE `/tasks/:id`
- 200 → `{ ok: true }`
- 404 → `{ error: 'Task not found' }`

