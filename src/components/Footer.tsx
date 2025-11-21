const links = [
  "Matematika SD - SMA",
  "Programming Pemula",
  "Cara kerja",
  "Tentang kami",
];

export function Footer() {
  return (
    <footer className="bg-cloud">
      <div className="container flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-charcoal">ED Teach</p>
          <p className="max-w-xs text-sm text-muted">
            Kursus Matematika (SD, SMP, SMA) dan Programming dengan kelas
            online/offline, mentor aktif, dan dashboard progres siswa.
          </p>
          <div className="flex gap-4 text-sm font-semibold text-charcoal">
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>

        <ul className="space-y-3 text-base font-medium text-charcoal">
          {links.map((link, index) => (
            <li key={link} className="flex items-center gap-4">
              <span className="text-sm text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{link}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
