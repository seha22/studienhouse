"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { EnrollmentModal } from "./EnrollmentModal";
import { useAuth } from "./auth/AuthProvider";

const links = [
  { name: "Home", href: "#home" },
  { name: "Kursus", href: "#courses" },
  { name: "Cara kerja", href: "#cara-kerja" },
  { name: "Testimoni", href: "#testimoni" },
  { name: "Tentang", href: "#tentang" },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const [showEnroll, setShowEnroll] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-5">
          <Link
            href="#home"
            className="flex items-center gap-2 text-lg font-semibold text-charcoal"
          >
            <div className="rounded-lg bg-orange px-2 py-1 text-sm text-charcoal">
              SH
            </div>
            StudienHouse
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-stone md:flex">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-charcoal"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden md:block">
              <Button onClick={() => setShowEnroll(true)}>Daftar kelas</Button>
            </div>
            {user ? (
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href="/dashboard"
                  className="rounded-pill bg-orange px-4 py-2 font-semibold text-charcoal"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-pill border border-charcoal px-3 py-2 font-semibold text-charcoal"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-pill border border-charcoal px-4 py-2 text-sm font-semibold text-charcoal"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <EnrollmentModal open={showEnroll} onClose={() => setShowEnroll(false)} />
    </>
  );
}
