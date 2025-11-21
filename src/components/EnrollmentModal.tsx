"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { Button } from "./Button";

const whatsappNumber = "628999053136";

type EnrollmentModalProps = {
  open: boolean;
  onClose: () => void;
};

const gradeOptions = [
  "SD (1-3)",
  "SD (4-6)",
  "SMP",
  "SMA",
  "Gap year / umum",
];

const interestOptions = ["Matematika", "Programming", "Matematika + Programming"];

export function EnrollmentModal({ open, onClose }: EnrollmentModalProps) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [interest, setInterest] = useState(interestOptions[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !grade.trim()) {
      setError("Isi nama dan tingkat kelas terlebih dahulu.");
      return;
    }

    const baseMessage = [
      `Halo, saya ${name.trim()}`,
      `Tingkat: ${grade.trim()}`,
      `Minat: ${interest}`,
    ];
    if (note.trim()) baseMessage.push(`Catatan: ${note.trim()}`);
    const message = encodeURIComponent(baseMessage.join(" | "));

    const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  const closeOnBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const quickLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo, saya ingin konsultasi daftar kelas di StudienHouse."
  )}`;

  return (
    <div
      ref={dialogRef}
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-display ring-1 ring-line">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone transition hover:bg-cloud"
          aria-label="Tutup form"
        >
          ✕
        </button>
        <div className="space-y-2 pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Daftar kelas</p>
          <h3 className="text-2xl font-semibold text-charcoal">Konsultasi via WhatsApp</h3>
          <p className="text-sm text-muted">
            Isi data singkat, kami arahkan ke WhatsApp untuk melanjutkan pendaftaran sesuai jadwal dan minat.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-charcoal">
              <span>Nama lengkap</span>
              <input
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-charcoal">
              <span>Tingkat kelas</span>
              <select
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">Pilih</option>
                {gradeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-charcoal">
            <span>Peminatan</span>
            <select
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              {interestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-charcoal">
            <span>Pertanyaan/target belajar (opsional)</span>
            <textarea
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange"
              rows={3}
              placeholder="Contoh: ingin fokus UTBK, remedial, atau project website."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit">Kirim & buka WhatsApp</Button>
            <a
              href={quickLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-charcoal underline underline-offset-4"
            >
              Chat cepat tanpa form
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
