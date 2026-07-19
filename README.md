# QuickTasks

A small full-stack task tracker built with Next.js, React, and TypeScript, using Prisma, Zod, and TanStack Query.

## Stack

- Next.js (App Router) - frontend pages and backend API routes in one project
- Prisma + SQLite - database ORM; SQLite needs no server setup, just a local file
- Zod - validates incoming request data before it touches the database
- TanStack Query - handles data fetching, caching, and loading/error states on the frontend

## Features

- Add a task with a title and priority (low/medium/high)
- Mark a task as complete
- Delete a task

## Getting started

Run: npm install
Then: npx prisma migrate dev
Then: npm run dev
Open http://localhost:3000

## Project structure

- prisma/schema.prisma - the Task data model
- src/lib/validation.ts - Zod schema for validating new tasks
- src/lib/prisma.ts - Prisma client setup
- src/app/api/tasks/route.ts - GET (list tasks) and POST (create task) endpoints
- src/app/api/tasks/[id]/route.ts - PATCH (toggle complete) and DELETE endpoints
- src/app/page.tsx - main UI, using TanStack Query for data fetching
