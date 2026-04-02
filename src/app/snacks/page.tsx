"use client";
import { useEffect, useState, useCallback } from "react";
import { Snack, Student } from "@/types";
import { getSnacks, getStudents, createOrder } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import SnackCard from "@/components/snacks/SnackCard";
import OrderForm from "@/components/orders/OrderForm";
import Modal from "@/components/ui/Modal";
import { SnackCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingBag } from "lucide-react";

const CATEGORIES = ["all", "main", "snack", "drink", "dessert"] as const;
type Category = (typeof CATEGORIES)[number];

export default function SnacksPage() {
  const { snacks, setSnacks, students, setStudents, addOrder, updateStudentSpent, incrementSnackOrders } =
    useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [snacksData, studentsData] = await Promise.all([getSnacks(), getStudents()]);
      setSnacks(snacksData);
      setStudents(studentsData);
    } catch {
      setError("Failed to load snacks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [setSnacks, setStudents]);

  useEffect(() => { load(); }, [load]);

  const filteredSnacks =
    activeCategory === "all" ? snacks : snacks.filter((s) => s.category === activeCategory);

  const handleOrder = async ({ studentId, quantity }: { studentId: string; quantity: number }) => {
    if (!selectedSnack) return;
    const order = await createOrder({ studentId, snackId: selectedSnack.id, quantity });
    addOrder(order);
    updateStudentSpent(studentId, order.payableAmount);
    incrementSnackOrders(selectedSnack.id);
    setSelectedSnack(null);
    setSuccessMsg(`Order placed! ₹${order.payableAmount} charged.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-edzy-primary rounded-xl flex items-center justify-center">
            <ShoppingBag size={18} className="text-edzy-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-edzy-primary">Snack Menu</h1>
        </div>
        <p className="text-edzy-muted font-body text-sm ml-12">
          {snacks.length} items available today
        </p>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-body text-sm font-semibold animate-slide-up flex items-center gap-2">
          <span>✅</span> {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-body text-sm animate-slide-up">
          {error}{" "}
          <button onClick={load} className="underline font-semibold">Retry</button>
        </div>
      )}

      {/* Category filter */}
      {!loading && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold font-body capitalize whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-edzy-primary text-white"
                  : "bg-white text-edzy-muted border border-slate-200 hover:border-edzy-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SnackCardSkeleton key={i} />)}
        </div>
      ) : filteredSnacks.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No snacks found"
          description="Try a different category filter."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSnacks.map((snack) => (
            <SnackCard
              key={snack.id}
              snack={snack}
              onOrder={setSelectedSnack}
            />
          ))}
        </div>
      )}

      {/* Order Modal */}
      <Modal
        isOpen={!!selectedSnack}
        onClose={() => setSelectedSnack(null)}
        title="Place Order"
      >
        {selectedSnack && (
          <OrderForm
            snack={selectedSnack}
            students={students}
            onSubmit={handleOrder}
            onCancel={() => setSelectedSnack(null)}
          />
        )}
      </Modal>
    </div>
  );
}
