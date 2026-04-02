# 🍽️ Edzy Canteen — School Canteen Ordering System

A frontend prototype for a school canteen digital ordering system, built as a screening task for **Edzy** (Paraheights Technologies).

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd edzy-canteen

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧱 Libraries Used

| Library | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Global state management (snacks, students, orders) |
| **React Hook Form** | Form state and submission handling |
| **Zod + @hookform/resolvers** | Schema-based form validation |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Conditional class name utilities |

---

## 📦 Mock Data Approach

No external backend is used. All data is **mocked client-side** with a simulated async delay to replicate real API behavior:

- **Initial seed data** — defined in `src/lib/api.ts` (10 snacks, 3 students, 4 orders)
- **localStorage persistence** — all mutations (create student, place order) are persisted to localStorage under the keys `edzy_students`, `edzy_orders`, and `edzy_snacks`
- **Mock API functions** — `getSnacks()`, `getStudents()`, `getStudentById()`, `createStudent()`, `createOrder()` each simulate async network delay (300–600ms) and follow the same contract as the real endpoints

### Mock Endpoints Simulated

| Endpoint | Function |
|---|---|
| `GET /snacks` | `getSnacks()` |
| `GET /students` | `getStudents()` |
| `GET /students/:id` | `getStudentById(id)` |
| `POST /students` | `createStudent({ name })` |
| `POST /orders` | `createOrder({ studentId, snackId, quantity })` |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── snacks/page.tsx          # Snacks listing + order modal
│   ├── students/
│   │   ├── page.tsx             # Student list
│   │   ├── new/page.tsx         # Create student form
│   │   └── [id]/page.tsx        # Student detail + order history
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                      # Shared: Button, Modal, Badge, Skeleton, Navbar, EmptyState
│   ├── snacks/SnackCard.tsx     # Reusable snack display card
│   ├── students/                # StudentListItem, CreateStudentForm
│   └── orders/                  # OrderForm, OrderItem
├── lib/
│   ├── api.ts                   # All mock API functions + localStorage logic
│   └── utils.ts                 # cn(), formatCurrency(), formatDate()
├── store/
│   └── useAppStore.ts           # Zustand global store
└── types/index.ts               # TypeScript interfaces
```

---

## ✅ Features Implemented

- **Snacks Page** — grid of all snacks with category filter, order modal
- **Students Page** — list with name, referral code, total spent
- **Student Detail** — order history, total spent, place new order
- **Create Student** — validated form with auto-generated referral code
- **Loading states** — skeleton loaders on all pages
- **Error states** — inline error messages with retry
- **Responsive design** — mobile-first layout
- **LocalStorage persistence** — orders and students survive page refresh
- **TypeScript** — full type coverage
- **Form validation** — Zod schemas with React Hook Form
