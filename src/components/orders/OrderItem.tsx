import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MOCK_SNACKS } from "@/lib/api";
import { Package } from "lucide-react";

interface OrderItemProps {
  order: Order;
}

export default function OrderItem({ order }: OrderItemProps) {
  const snack = MOCK_SNACKS.find((s) => s.id === order.snackId);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 animate-fade-in">
      <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
        {snack?.emoji ?? <Package size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-edzy-primary truncate">{order.snackName}</p>
        <p className="text-xs text-edzy-muted font-body">
          Qty: {order.quantity} · {formatDate(order.createdAt)}
        </p>
      </div>
      <p className="font-display font-bold text-edzy-accent text-lg flex-shrink-0">
        {formatCurrency(order.payableAmount)}
      </p>
    </div>
  );
}
