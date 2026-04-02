"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Users, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/snacks", label: "Snacks", icon: ShoppingBag },
  { href: "/students", label: "Students", icon: Users },
  { href: "/students/new", label: "Add Student", icon: PlusCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/snacks" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-edzy-primary rounded-xl flex items-center justify-center">
            <span className="text-edzy-accent font-display font-bold text-sm">E</span>
          </div>
          <span className="font-display font-bold text-edzy-primary text-lg">edzy</span>
          <span className="hidden sm:inline text-xs font-body text-edzy-muted ml-1 bg-slate-100 px-2 py-0.5 rounded-full">
            canteen
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/snacks" && pathname.startsWith(href) && href !== "/students/new");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold font-body transition-all",
                  isActive
                    ? "bg-edzy-primary text-white"
                    : "text-edzy-muted hover:text-edzy-primary hover:bg-slate-50"
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
