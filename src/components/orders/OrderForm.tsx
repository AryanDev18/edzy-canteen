"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Snack, Student } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";

const orderSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  quantity: z.coerce.number().min(1).max(5),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  snack: Snack;
  students: Student[];
  onSubmit: (data: OrderFormData) => Promise<void>;
  onCancel: () => void;
}

export default function OrderForm({ snack, students, onSubmit, onCancel }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity") || 1;
  const total = snack.price * quantity;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Snack summary */}
      <div className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
        <span className="text-2xl">{snack.emoji}</span>
        <div>
          <p className="font-display font-bold text-edzy-primary">{snack.name}</p>
          <p className="text-sm text-edzy-muted font-body">{formatCurrency(snack.price)} each</p>
        </div>
      </div>

      {/* Student select */}
      <div>
        <label className="block text-sm font-semibold font-body text-edzy-primary mb-1.5">
          Select Student *
        </label>
        <select
          {...register("studentId")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-edzy-accent focus:border-transparent"
        >
          <option value="">Choose a student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.referralCode})
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-red-500 text-xs mt-1 font-body">{errors.studentId.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold font-body text-edzy-primary mb-1.5">
          Quantity (1–5)
        </label>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((q) => (
            <label key={q} className="flex-1">
              <input type="radio" value={q} {...register("quantity")} className="sr-only peer" />
              <div className="text-center py-2 rounded-xl border-2 border-slate-200 font-body font-semibold text-sm cursor-pointer peer-checked:border-edzy-accent peer-checked:bg-amber-50 peer-checked:text-edzy-primary transition-all">
                {q}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 bg-edzy-primary rounded-xl">
        <span className="text-white/70 font-body text-sm">Total Payable</span>
        <span className="font-display font-bold text-edzy-accent text-xl">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button variant="ghost" size="md" className="flex-1" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="secondary" size="md" className="flex-1" loading={isSubmitting} type="submit">
          Place Order
        </Button>
      </div>
    </form>
  );
}
