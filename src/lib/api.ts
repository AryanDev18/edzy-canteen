import { Snack, Student, Order, CreateStudentInput, CreateOrderInput } from "@/types";

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_SNACKS: Snack[] = [
  { id: "s1", name: "Samosa", price: 15, ordersCount: 342, emoji: "🥟", category: "snack" },
  { id: "s2", name: "Vada Pav", price: 20, ordersCount: 289, emoji: "🍔", category: "main" },
  { id: "s3", name: "Maggi", price: 30, ordersCount: 198, emoji: "🍜", category: "main" },
  { id: "s4", name: "Cold Coffee", price: 40, ordersCount: 167, emoji: "☕", category: "drink" },
  { id: "s5", name: "Bread Pakoda", price: 25, ordersCount: 145, emoji: "🍞", category: "snack" },
  { id: "s6", name: "Mango Shake", price: 45, ordersCount: 132, emoji: "🥭", category: "drink" },
  { id: "s7", name: "Gulab Jamun", price: 20, ordersCount: 98, emoji: "🍮", category: "dessert" },
  { id: "s8", name: "Poha", price: 25, ordersCount: 87, emoji: "🍚", category: "main" },
  { id: "s9", name: "Chai", price: 10, ordersCount: 512, emoji: "🫖", category: "drink" },
  { id: "s10", name: "Dhokla", price: 30, ordersCount: 74, emoji: "🟡", category: "snack" },
];

const INITIAL_STUDENTS: Student[] = [
  { id: "st1", name: "Priya Sharma", referralCode: "PRIYA-2XK9", totalSpent: 450, createdAt: "2024-01-15T10:00:00Z" },
  { id: "st2", name: "Rahul Verma", referralCode: "RAHUL-7MNQ", totalSpent: 320, createdAt: "2024-01-16T09:30:00Z" },
  { id: "st3", name: "Ananya Singh", referralCode: "ANANY-4PRT", totalSpent: 680, createdAt: "2024-01-17T11:15:00Z" },
];

const INITIAL_ORDERS: Order[] = [
  { id: "o1", studentId: "st1", snackId: "s1", snackName: "Samosa", quantity: 2, payableAmount: 30, createdAt: "2024-03-01T10:00:00Z" },
  { id: "o2", studentId: "st1", snackId: "s4", snackName: "Cold Coffee", quantity: 1, payableAmount: 40, createdAt: "2024-03-02T11:00:00Z" },
  { id: "o3", studentId: "st2", snackId: "s3", snackName: "Maggi", quantity: 1, payableAmount: 30, createdAt: "2024-03-01T12:00:00Z" },
  { id: "o4", studentId: "st3", snackId: "s6", snackName: "Mango Shake", quantity: 2, payableAmount: 90, createdAt: "2024-03-03T09:00:00Z" },
];

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

const STORAGE_KEYS = {
  students: "edzy_students",
  orders: "edzy_orders",
  snacks: "edzy_snacks",
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Simulated API Delay ──────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getSnacks(): Promise<Snack[]> {
  await delay(400);
  const stored = getFromStorage<Snack[]>(STORAGE_KEYS.snacks, MOCK_SNACKS);
  return stored;
}

export async function getStudents(): Promise<Student[]> {
  await delay(400);
  return getFromStorage<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS);
}

export async function getStudentById(id: string): Promise<Student | null> {
  await delay(300);
  const students = getFromStorage<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS);
  return students.find((s) => s.id === id) ?? null;
}

export async function createStudent(input: CreateStudentInput): Promise<Student> {
  await delay(500);
  const students = getFromStorage<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS);
  const nameSlug = input.name.toUpperCase().replace(/\s+/g, "").slice(0, 5);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const student: Student = {
    id: `st${Date.now()}`,
    name: input.name.trim(),
    referralCode: `${nameSlug}-${suffix}`,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  };
  const updated = [...students, student];
  saveToStorage(STORAGE_KEYS.students, updated);
  return student;
}

export async function getOrdersByStudentId(studentId: string): Promise<Order[]> {
  await delay(300);
  const orders = getFromStorage<Order[]>(STORAGE_KEYS.orders, INITIAL_ORDERS);
  return orders.filter((o) => o.studentId === studentId);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await delay(600);
  const snacks = getFromStorage<Snack[]>(STORAGE_KEYS.snacks, MOCK_SNACKS);
  const students = getFromStorage<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS);
  const orders = getFromStorage<Order[]>(STORAGE_KEYS.orders, INITIAL_ORDERS);

  const snack = snacks.find((s) => s.id === input.snackId);
  if (!snack) throw new Error("Snack not found");

  const payableAmount = snack.price * input.quantity;

  const order: Order = {
    id: `o${Date.now()}`,
    studentId: input.studentId,
    snackId: input.snackId,
    snackName: snack.name,
    quantity: input.quantity,
    payableAmount,
    createdAt: new Date().toISOString(),
  };

  // Update orders count on snack
  const updatedSnacks = snacks.map((s) =>
    s.id === input.snackId ? { ...s, ordersCount: s.ordersCount + 1 } : s
  );
  saveToStorage(STORAGE_KEYS.snacks, updatedSnacks);

  // Update student's total spent
  const updatedStudents = students.map((s) =>
    s.id === input.studentId ? { ...s, totalSpent: s.totalSpent + payableAmount } : s
  );
  saveToStorage(STORAGE_KEYS.students, updatedStudents);

  const updatedOrders = [...orders, order];
  saveToStorage(STORAGE_KEYS.orders, updatedOrders);

  return order;
}
