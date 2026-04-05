# GoPrint

GoPrint is a print and photocopy ordering application for the Unpam Viktor campus environment. This repository uses a monorepo concept so that the frontend and backend can be developed in one neat place, easily deployed, and comfortable to scale up.

## Monorepo Structure

```text
goprint/
|- frontend/   -> React + TypeScript + Vite
|- backend/    -> Express + TypeScript
|- docs/       -> Application concepts and architecture
|- database/   -> Initial MySQL schema
```

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MySQL
- File storage: Vercel Blob
- Deployment target: Vercel

## Core Features of GoPrint

- Students/lecturers upload documents
- Select print and photocopy quantities per file
- Choose pickup method: delivery or self-pickup
- Choose payment method: transfer or cash
- Monitor order status in real-time
- Admins monitor users, service providers, and orders
- Copy shop processes orders and updates status

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Run the frontend:

```bash
npm run dev:frontend
```

3. Run the backend:

```bash
npm run dev:backend
```

## MVP Demo Accounts

- Admin: `admin@goprint.local` / `admin123`
- Copy Shop: `copyshop@goprint.local` / `copy123`
- Student: `student@goprint.local` / `student123`

## Current MVP Features

- User authentication (login & register)
- Role-based dashboards (admin, copy shop, student/lecturer)
- Basic CRUD operations for orders (frontend ↔ backend with MySQL)
- Document upload to Vercel Blob before order creation
- Basic cost calculation (printing, photocopying, source print, and delivery fee)
- User data includes `nim` (student ID) and `study_program`
- All entity IDs are generated using UUID format

## Environment Setup

Copy the example environment files:

- `frontend/.env.example` -> `frontend/.env`
- `backend/.env.example` -> `backend/.env`

## Database Setup

1. Run `database/schema.sql`
2. Then run dengan `database/seed.sql`

## Vercel Deployment Notes

- The frontend can be deployed as a Vite project.
- The backend is configured with:
    - Express entry point for local development
    - `api/index.ts` for Vercel serverless deployment
- Document uploads use Vercel Blob, allowing files to be stored separately from the server.

For more details:

- Architecture documentation: `docs/architecture.md`
- Database schema: `database/schema.sql`
- Initial seed data: `database/seed.sql`