"use client";
import Link from "next/link";
import { Student } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ChevronRight, Tag, Wallet } from "lucide-react";

interface StudentListItemProps {
  student: Student;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

export default function StudentListItem({ student }: StudentListItemProps) {
  const colorClass = avatarColors[student.name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-edzy-accent/30 hover:shadow-md hover:shadow-amber-50 transition-all duration-200 animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0 ${colorClass}`}
        >
          {getInitials(student.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-edzy-primary truncate">{student.name}</p>
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-edzy-muted font-body">
              <Tag size={11} />
              {student.referralCode}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-edzy-accent font-body">
              <Wallet size={11} />
              {formatCurrency(student.totalSpent)} spent
            </span>
          </div>
        </div>

        {/* Action */}
        <Link href={`/students/${student.id}`}>
          <Button variant="ghost" size="sm" className="flex-shrink-0">
            View
            <ChevronRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
