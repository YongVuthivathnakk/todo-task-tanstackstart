# Todo Task TanStack

A learning-focused Todo application built to understand how TanStack Start works in practice with Drizzle ORM, PostgreSQL, and Docker for local development.

This project demonstrates a full-stack flow using:

- TanStack Start
- TanStack Router
- React
- Drizzle ORM
- PostgreSQL
- Docker Compose
- Tailwind-based UI

This project was created for learning and is inspired by the tutorial: https://youtu.be/KsHbs5RMVYU

## Overview

The goal of this project is to explore the basics of TanStack Start while building a small todo app that stores data in a Postgres database. It covers the interaction between routing, server functions, and database access in a modern full-stack app.

## Tech stack

- React 19
- TanStack Router
- TanStack Start
- TypeScript
- Drizzle ORM
- PostgreSQL 17
- Docker Compose
- Vite
- Tailwind CSS

## Project structure

```bash
.
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
├── src/
│   ├── components/
│   ├── db/
│   ├── defnitions/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   └── styles.css
├── public/
├── tsconfig.json
├── vite.config.ts
├── README.md
└── .env.local
```

## Prerequisites

Make sure the following are installed:

- Node.js
- Bun
- Docker Desktop or Docker Engine

## Environment setup

Create a `.env.local` file in the project root with the following values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db
```

These values match the database configuration in `docker-compose.yml`.

## Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL container in Docker for local development.

## Install dependencies

```bash
bun install
```

## Run the app

```bash
bun run dev
```

Open the app in the browser at:

```text
http://localhost:3000
```

## Database commands

This project uses Drizzle for managing the database schema.

### Generate schema migration files

```bash
bun run db:generate
```

### Push schema directly to the database

```bash
bun run db:push
```

### Run migrations

```bash
bun run db:migrate
```

### Open Drizzle Studio

```bash
bun run db:studio
```

## Features

The app includes the following functionality:

- View todo list
- Add a new todo
- Edit an existing todo
- Mark todo as complete/incomplete
- Delete a todo

## Core database model

The main table is defined in `src/db/schema.ts`:

```ts
export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  isComplete: boolean().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})
```

## Learning notes

This project is useful for understanding:

- TanStack Start project structure
- File-based routing with TanStack Router
- Using server functions for database operations
- Connecting a React app to PostgreSQL using Drizzle ORM
- Running a local development database with Docker

## Common scripts

```bash
bun run lint
bun run format
bun run check
bun run build
```

## Troubleshooting

### Database connection issues

Check that:

- Docker is running
- `.env.local` matches `docker-compose.yml`
- Postgres is listening on `localhost:5432`
- `DATABASE_URL` is correct

### App is not starting

Try:

```bash
bun install
bun run dev
```

If the database has not been initialized yet:

```bash
docker compose up -d
bun run db:push
```

## Credit

This project is based on the educational content from:

https://youtu.be/KsHbs5RMVYU

## Conclusion

This repository is a practical example of building a small full-stack app with TanStack Start and integrating it with a PostgreSQL database via Drizzle, all while using Docker for local development.
