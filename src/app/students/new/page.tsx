"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createStudent } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import CreateStudentForm from "@/components/students/CreateStudentForm";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";

export default function NewStudentPage() {
  const router = useRouter();
  const { addStudent } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (name: string) => {
    try {
      setError(null);
      const student = await createStudent({ name });
      addStudent(student);
      router.push(`/students/${student.id}`);
    } catch {
      setError("Failed to create student. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Back */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-edzy-muted hover:text-edzy-primary text-sm font-semibold font-body mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Students
      </Link>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-edzy-primary px-6 py-8">
          <div className="w-14 h-14 bg-edzy-accent/20 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus size={26} className="text-edzy-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">New Student</h1>
          <p className="text-white/60 font-body text-sm mt-1">
            Register a student to start placing canteen orders.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
              {error}
            </div>
          )}
          <CreateStudentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
