import { create } from "zustand";
import { Snack, Student, Order } from "@/types";

interface AppState {
  snacks: Snack[];
  students: Student[];
  orders: Order[];
  setSnacks: (snacks: Snack[]) => void;
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateStudentSpent: (studentId: string, amount: number) => void;
  incrementSnackOrders: (snackId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  snacks: [],
  students: [],
  orders: [],
  setSnacks: (snacks) => set({ snacks }),
  setStudents: (students) => set({ students }),
  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  updateStudentSpent: (studentId, amount) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, totalSpent: s.totalSpent + amount } : s
      ),
    })),
  incrementSnackOrders: (snackId) =>
    set((state) => ({
      snacks: state.snacks.map((s) =>
        s.id === snackId ? { ...s, ordersCount: s.ordersCount + 1 } : s
      ),
    })),
}));
