export interface Snack {
  id: string;
  name: string;
  price: number;
  ordersCount: number;
  emoji: string;
  category: "main" | "snack" | "drink" | "dessert";
}

export interface Student {
  id: string;
  name: string;
  referralCode: string;
  totalSpent: number;
  createdAt: string;
}

export interface Order {
  id: string;
  studentId: string;
  snackId: string;
  snackName: string;
  quantity: number;
  payableAmount: number;
  createdAt: string;
}

export interface CreateStudentInput {
  name: string;
}

export interface CreateOrderInput {
  studentId: string;
  snackId: string;
  quantity: number;
}
