# PickPackaging

### B2B Packaging Marketplace — connecting brands with manufacturers at scale

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Live Demo:** [https://pickpackaging.vercel.app](https://pickpackaging.vercel.app) &nbsp;|&nbsp; **Client Repo** &nbsp;|&nbsp; **Server Repo**

---

## What is PickPackaging?

PickPackaging is a production-grade B2B marketplace that bridges the gap between packaging brands and manufacturers across the food service, agriculture, and industrial sectors. Built for procurement managers who need a fast, reliable platform to source packaging at scale — architected with a scalable component system, strict TypeScript patterns, and a minimalist design language optimized for performance and usability.

---

## Overview

The platform solves a real procurement pain point: fragmented supplier discovery and order management spread across emails, calls, and disconnected tools. PickPackaging consolidates everything into one structured marketplace — verified manufacturers, tiered partner pricing, persistent cart flows, and a real-time admin dashboard — all built with a performance-first Next.js architecture.

---

## How It Works

1. **Register & Browse** — Brands and procurement managers sign up and explore verified packaging manufacturers filtered by industry category: food service, agriculture, or industrial.
2. **Add to Cart & Wishlist** — Buyers build their order using a persistent cart and wishlist powered by React Context and TypeScript, with session-safe state that never resets mid-session.
3. **Unlock Partner Benefits** — Verified business partners gain access to exclusive pricing tiers, order-based rewards, and competitive benefits through the Loyalty & Partner Programme.
4. **Place Orders** — Buyers complete purchases with full visibility into product availability and pricing. Order status is tracked in real time.
5. **Admin Oversight** — Platform admins monitor inventory and order workflows through a server-component-driven dashboard — zero lag, no manual refresh required.

---

## Who Uses It?

| User Type | Role |
|---|---|
| **Procurement Managers** | Source packaging products at scale from verified manufacturers in one place |
| **Packaging Brands** | List products and reach B2B buyers across multiple industry verticals |
| **Manufacturers** | Connect with clients and manage inbound orders from a central dashboard |
| **Platform Admins** | Monitor inventory, orders, and partner activity in real time |

---

## Benefits

- Eliminates fragmented procurement by centralizing manufacturer discovery and ordering into one platform
- Reduces sourcing cost through tiered partner pricing and order-based reward unlocks
- Improves purchase completion by ensuring cart and wishlist state never resets mid-session
- Gives admins instant visibility into stock and order status — no manual refresh, no lag
- Scales without performance degradation — data-heavy operations are server-side via Next.js Server Components
- Strict TypeScript patterns reduce runtime errors and enforce predictable data contracts across the full stack

---

## Features

### Loyalty & Partner Programme System
A tiered partnership system built with JWT-based role access and MongoDB. Verified business partners unlock exclusive pricing, competitive benefits, and order-based rewards — giving growing businesses tangible cost advantages on every order and streamlining their procurement workflow.

### Server-Component-Driven Admin Dashboard
A real-time inventory and order monitoring dashboard leveraging Next.js Server Components and MongoDB. Data-heavy operations are offloaded to the server, giving admins instant visibility into product status and order workflows — without lag, loading states, or page reloads.

### Persistent Cart & State Management
A cart and wishlist system built with React Context and TypeScript, ensuring predictable state transitions and session-safe data persistence. Buyers never lose their selections mid-session, reducing friction and improving purchase completion rate.

### JWT Authentication & Role-Based Access Control
Secure route protection with role-based access differentiating buyers, verified partners, and admins — each role scoped to exactly the permissions and features relevant to their workflow.

### TanStack Query Data Layer
Efficient server-state management using TanStack Query for background refetching, smart caching, stale-data invalidation, and mutation tracking — keeping UI data fresh without redundant network calls.

### TypeScript-First Architecture
Strict TypeScript patterns enforced across the full component tree — catching bugs at compile time, improving developer tooling, and maintaining consistent data contracts between client and server.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js (App Router) | Core framework; Server Components used for data-heavy admin views |
| TypeScript | Type safety and predictable data contracts across the component tree |
| TailwindCSS | Utility-first styling with a minimalist, performance-optimized design language |
| TanStack Query | Client-side server-state: fetching, caching, background refetching, mutation tracking |
| React Context | Global cart and wishlist state management with TypeScript-enforced contracts |
| GSAP | Scroll-triggered animations and component transitions on the landing page |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API routing and middleware |
| MongoDB | Flexible document store for products, orders, and partner tier data |
| Mongoose | Schema validation and MongoDB ODM |
| JWT Authentication | Secure token-based auth and role-based route protection |
| Firebase | User authentication flows and image/asset storage |

---

## Getting Started

Clone both the client and server repositories and follow the steps below.

### 1. Clone the repositories

```bash
git clone https://github.com/nirarhan/pickpackaging-client
git clone https://github.com/nirarhan/pickpackaging-server
```

### 2. Install dependencies

```bash
# Client
cd pickpackaging-client
npm install

# Server
cd ../pickpackaging-server
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the **client** root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

Create a `.env` file in the **server** root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the development servers

```bash
# Start the server
cd pickpackaging-server
npm run dev

# Start the client (in a new terminal)
cd pickpackaging-client
npm run dev
```

- Client: `http://localhost:3000`
- Server: `http://localhost:5000`

---

## Project Structure

```
pickpackaging-client/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Auth routes (login, register)
│   ├── dashboard/        # Admin dashboard (Server Components)
│   └── marketplace/      # Product listing and detail pages
├── components/           # Reusable UI components
├── context/              # React Context (cart, wishlist, auth)
├── hooks/                # Custom TanStack Query hooks
├── lib/                  # Utility functions and API clients
└── types/                # Shared TypeScript interfaces

pickpackaging-server/
├── controllers/          # Route handler logic
├── middleware/            # JWT auth and role guards
├── models/               # Mongoose schemas
├── routes/               # Express route definitions
└── utils/                # Helpers and validators
```

---

## Author

**Nabil Mahmud** — Frontend Web Developer

- Email: nirarhan@gmail.com
- LinkedIn: [linkedin.com/in/nabil-mahmud](https://linkedin.com/in/nabil-mahmud)
- GitHub: [github.com/nirarhan](https://github.com/nirarhan)
- Portfolio: [nabil-portfolio.vercel.app](https://nabil-portfolio.vercel.app)

---

*Built with React, Next.js, and a focus on clean, maintainable, performance-conscious interfaces.*
