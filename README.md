QuickPalo – Appointment Booking & Queue Management System

QuickPalo is a full-stack web application designed to modernize traditional appointment scheduling and queuing systems. It enables users to book appointments remotely, complete secure payments, and verify bookings via QR-based check-in. Service providers can manage slots, monitor queues, and optimize workflow efficiency.

The system is built using a modern web technology stack with layered architecture principles to ensure scalability, maintainability, and performance.

🏗 Architecture Overview

Frontend: Next.js (React-based, SSR-enabled)

Backend: Node.js + Express (RESTful API)

Database: MongoDB with Mongoose

Language: TypeScript

Authentication: JWT-based authentication

Architecture Pattern: Layered (Onion) Architecture

📦 Frontend – Next.js Application
Overview

The frontend is built using Next.js with App Router architecture. It supports server-side rendering (SSR), file-based routing, and server/client component separation.

Key Features

Server-Side Rendering (SSR) for improved performance

File-based (convention-based) routing

Server Actions for secure backend logic execution

Authentication-aware middleware

Component-level separation (Server vs Client Components)

Secure API integration with backend

Dynamic appointment booking UI

QR-based booking confirmation display

Folder Structure
frontend/
│
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── appointments/
│   └── api/
│
├── components/
├── lib/
├── middleware.ts
├── services/
└── types/
Key Technologies Used

Next.js (App Router)

React

TypeScript

Context API (or state management solution used)

Fetch / Axios for API communication

Running the Frontend
cd frontend
npm install
npm run dev

Application runs on:

http://localhost:3000
Environment Variables

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_SECRET=your_secret_key
