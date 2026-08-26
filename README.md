# EPFO Member Portal

A responsive member portal inspired by the supplied EPFO reference design. It provides secure member sign-in, balance and contribution data, passbook viewing, claims, nominees, and a support area.

## Stack

- React 19, TypeScript, Vite and a custom responsive CSS design system
- Express 5 REST API with Zod validation and centralized error responses
- PostgreSQL with Prisma ORM
- JWT authentication and bcrypt password hashing
- Lucide icons

## Features

- Protected dashboard with PF balance, employee/employer totals, and recent contribution information
- Passbook table backed by persisted contribution records
- Create claims with validation and a visible status history
- Create and remove nominees; the API enforces a 100% total-share cap
- Responsive desktop, tablet, and mobile navigation
- Accessible labelled forms, focusable controls, status feedback, and error messaging

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a secure `JWT_SECRET`.
2. Install packages: `npm install`
3. Generate the Prisma client: `npm run db:generate`
4. Apply the schema: `npm run db:migrate -- --name init`
5. Seed the demonstration member: `npm run db:seed`
6. Start frontend and API together: `npm run dev`

The web app runs at `http://localhost:5173` and the API at `http://localhost:4000`.

## Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL Prisma connection URL |
| `JWT_SECRET` | Long random signing secret for access tokens |
| `PORT` | API port, defaults to `4000` |
| `VITE_API_URL` | Browser-visible URL for the API |

## Demo account

- Email: `member@epfo.demo`
- Password: `Demo@123`

## REST API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Create a JWT-backed session |
| POST | `/api/auth/register` | Register a member |
| GET | `/api/dashboard` | Member profile and portal data |
| POST | `/api/claims` | Submit a PF claim |
| POST | `/api/nominees` | Add nominee information |
| DELETE | `/api/nominees/:id` | Remove a nominee |

All member data endpoints require `Authorization: Bearer <token>`.

## Structure

```
src/                 React application and styling
backend/src/         Express API
prisma/schema.prisma Data model
prisma/seed.ts       Development data
```

## Notes

The EPFO identity and information shown are fictional demo content. The KYC, downloadable passbook, and AI assistant actions are intentionally client-side feedback in this self-contained starter; integrating official EPFO systems would require their sanctioned API access and compliance review.
