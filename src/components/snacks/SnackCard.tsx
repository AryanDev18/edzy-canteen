"use client";
import { Snack } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ShoppingCart, TrendingUp } from "lucide-react";

interface SnackCardProps {
  snack: Snack;
  onOrder: (snack: Snack) => void;
}

const categoryColors: Record<Snack["category"], "default" | "success" | "warning" | "info"> = {
  main: "info",
  snack: "warning",
  drink: "success",
  dessert: "default",
};

export default function SnackCard({ snack, onOrder }: SnackCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-edzy-accent/40 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 animate-fade-in flex flex-col gap-4">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {snack.emoji}
        </div>
        <Badge variant={categoryColors[snack.category]} className="capitalize">
          {snack.category}
        </Badge>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-display font-bold text-edzy-primary text-lg leading-tight">{snack.name}</h3>
        <p className="font-display text-2xl font-bold text-edzy-accent mt-1">
          {formatCurrency(snack.price)}
        </p>
      </div>

      {/* Orders count */}
      <div className="flex items-center gap-1.5 text-xs text-edzy-muted font-body">
        <TrendingUp size={13} className="text-edzy-accent" />
        <span>{snack.ordersCount.toLocaleString()} orders placed</span>
      </div>

      {/* Action */}
      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-auto"
        onClick={() => onOrder(snack)}
      >
        <ShoppingCart size={15} />
        Order
      </Button>
    </div>
  );
}
