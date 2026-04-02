"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getStudents } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import StudentListItem from "@/components/students/StudentListItem";
import { StudentCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { Users, PlusCircle } from "lucide-react";

export default function StudentsPage() {
  const { students, setStudents } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
    } catch {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, [setStudents]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-edzy-primary rounded-xl flex items-center justify-center">
              <Users size={18} className="text-edzy-accent" />
            </div>
            <h1 className="font-display text-3xl font-bold text-edzy-primary">Students</h1>
          </div>
          <p className="text-edzy-muted font-body text-sm ml-12">
            {loading ? "Loading…" : `${students.length} students registered`}
          </p>
        </div>
        <Link href="/students/new">
          <Button variant="secondary" size="sm">
            <PlusCircle size={15} />
            Add New
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-body text-sm">
          {error}{" "}
          <button onClick={load} className="underline font-semibold">Retry</button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <StudentCardSkeleton key={i} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon="👨‍🎓"
          title="No students yet"
          description="Add your first student to get started with canteen orders."
          action={
            <Link href="/students/new">
              <Button variant="secondary">Add First Student</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <StudentListItem key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
