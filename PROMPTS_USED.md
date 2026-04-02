# PROMPTS_USED.md

## AI Tools Used

**Tool:** Claude (claude.ai)  
**Model:** Claude Sonnet 4.6

---

## Prompts Used

### 1. Initial Architecture Planning
> "I have a frontend screening task for a school canteen ordering system using React/Next.js. Help me plan the project architecture — file structure, state management choice, and mock API approach before I start coding."

### 2. Zustand Store Design
> "Design a Zustand store for a canteen app that manages snacks, students, and orders. Include typed actions for adding orders, updating student totalSpent, and incrementing snack ordersCount."

### 3. Mock API with LocalStorage
> "Write a TypeScript mock API module that simulates GET /snacks, GET /students, GET /students/:id, POST /students, POST /orders with async delays and localStorage persistence."

### 4. React Hook Form + Zod Validation
> "Create an OrderForm component using React Hook Form and Zod. It should let the user pick a student from a dropdown and choose quantity 1-5 using radio buttons, then show a calculated total before submitting."

### 5. UI Component Design
> "Design a SnackCard component in React + Tailwind that shows emoji, name, price, category badge, ordersCount, and an Order button. Should have subtle hover animations."

### 6. Student Detail Page
> "Build a Next.js dynamic route page for student details that shows student info, total spent, order history sorted by date, and a button to place a new order with snack selection."

---

## Notes

- All AI-generated code was reviewed, understood, and manually verified before inclusion.
- Component logic, data flow, and state management were designed by me; AI assisted with implementation syntax and Tailwind class selection.
- No code was copy-pasted blindly — each suggestion was evaluated for correctness and fit with the overall architecture.
