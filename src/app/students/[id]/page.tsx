"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Student, Order, Snack } from "@/types";
import { getStudentById, getOrdersByStudentId, getSnacks, createOrder } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import OrderItem from "@/components/orders/OrderItem";
import OrderForm from "@/components/orders/OrderForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Wallet, Tag, Calendar, PlusCircle, ShoppingBag } from "lucide-react";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { students, addOrder, updateStudentSpent, incrementSnackOrders } = useAppStore();

  const [student, setStudent] = useState<Student | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Keep student in sync with store (for live totalSpent updates)
  const storeStudent = students.find((s) => s.id === id);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentData, ordersData, snacksData] = await Promise.all([
        getStudentById(id),
        getOrdersByStudentId(id),
        getSnacks(),
      ]);
      if (!studentData) {
        router.push("/students");
        return;
      }
      setStudent(studentData);
      setOrders(ordersData);
      setSnacks(snacksData);
    } catch {
      setError("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const displayStudent = storeStudent ?? student;

  const handleOrder = async ({ studentId, quantity, snackId }: { studentId: string; quantity: number; snackId?: string }) => {
    // snackId comes from the form via the modal
    if (!snackId) return;
    const order = await createOrder({ studentId, snackId, quantity });
    addOrder(order);
    updateStudentSpent(studentId, order.payableAmount);
    incrementSnackOrders(snackId);
    setOrders((prev) => [...prev, order]);
    setOrderModalOpen(false);
    setSuccessMsg(`Order placed for ₹${order.payableAmount}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !displayStudent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-body text-sm">
          {error ?? "Student not found."}{" "}
          <button onClick={load} className="underline font-semibold">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-edzy-muted hover:text-edzy-primary text-sm font-semibold font-body mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        All Students
      </Link>

      {/* Success */}
      {successMsg && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-body text-sm font-semibold animate-slide-up">
          ✅ {successMsg}
        </div>
      )}

      {/* Student Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-edzy-primary px-6 py-7">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{displayStudent.name}</h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-white/70 text-sm font-body">
                  <Tag size={13} />
                  {displayStudent.referralCode}
                </span>
                <span className="flex items-center gap-1.5 text-white/70 text-sm font-body">
                  <Calendar size={13} />
                  Joined {formatDate(displayStudent.createdAt)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs font-body mb-0.5 flex items-center gap-1 justify-end">
                <Wallet size={12} /> Total Spent
              </p>
              <p className="font-display text-2xl font-bold text-edzy-accent">
                {formatCurrency(displayStudent.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-body text-edzy-muted">
            <ShoppingBag size={15} className="text-edzy-accent" />
            <span><strong className="text-edzy-primary">{orders.length}</strong> orders placed</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setOrderModalOpen(true)}>
            <PlusCircle size={15} />
            New Order
          </Button>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold text-edzy-primary">Order History</h2>
        </div>
        <div className="px-6">
          {orders.length === 0 ? (
            <EmptyState
              icon="🛍️"
              title="No orders yet"
              description="Place the first order for this student."
              action={
                <Button variant="secondary" size="sm" onClick={() => setOrderModalOpen(true)}>
                  <PlusCircle size={15} /> Place Order
                </Button>
              }
            />
          ) : (
            orders
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => <OrderItem key={order.id} order={order} />)
          )}
        </div>
      </div>

      {/* Order Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title="Place New Order"
      >
        {/* We need a snack selection step inside the modal */}
        <NewOrderInModal
          students={[displayStudent]}
          snacks={snacks}
          onSubmit={handleOrder}
          onCancel={() => setOrderModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

// ─── Inline component for the modal (snack selection + order form) ───────────

function NewOrderInModal({
  students,
  snacks,
  onSubmit,
  onCancel,
}: {
  students: Student[];
  snacks: Snack[];
  onSubmit: (data: { studentId: string; quantity: number; snackId: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [selectedSnackId, setSelectedSnackId] = useState<string>("");
  const selectedSnack = snacks.find((s) => s.id === selectedSnackId);

  if (!selectedSnack) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold font-body text-edzy-primary">Choose a snack</p>
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {snacks.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSnackId(s.id)}
              className="flex items-center gap-2 p-3 rounded-xl border-2 border-slate-100 hover:border-edzy-accent hover:bg-amber-50 text-left transition-all"
            >
              <span className="text-xl">{s.emoji}</span>
              <div>
                <p className="text-xs font-semibold font-body text-edzy-primary leading-tight">{s.name}</p>
                <p className="text-xs text-edzy-accent font-body font-bold">₹{s.price}</p>
              </div>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="md" className="w-full" onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  return (
    <OrderForm
      snack={selectedSnack}
      students={students}
      onSubmit={({ studentId, quantity }) => onSubmit({ studentId, quantity, snackId: selectedSnack.id })}
      onCancel={onCancel}
    />
  );
}
