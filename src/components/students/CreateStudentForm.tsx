"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { User } from "lucide-react";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

type FormData = z.infer<typeof schema>;

interface CreateStudentFormProps {
  onSubmit: (name: string) => Promise<void>;
}

export default function CreateStudentForm({ onSubmit }: CreateStudentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data.name);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold font-body text-edzy-primary mb-2">
          Student Name *
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edzy-muted">
            <User size={16} />
          </div>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g. Priya Sharma"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-edzy-accent focus:border-transparent transition-all"
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1.5 font-body">{errors.name.message}</p>
        )}
        <p className="text-xs text-edzy-muted font-body mt-1.5">
          A unique referral code will be auto-generated.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        Create Student
      </Button>
    </form>
  );
}
