export type SectionHeaderContent = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  stats: Array<{ label: string; value: string }>;
  heroImage: string;
  heroAvatar: string;
  badge: { title: string; subtitle: string; description: string };
  mentor: { name: string; role: string; experience: string };
};

export type PopularCoursesContent = {
  header: SectionHeaderContent;
  featureCards: Array<{
    title: string;
    description: string;
    color: string;
    image: string;
  }>;
  sliderCards: Array<{
    title: string;
    subtitle: string;
    cta: string;
    students: string;
    bg: string;
    image: string;
  }>;
};

export type AboutContent = {
  header: SectionHeaderContent;
  collage: string[];
  bullets: Array<{ text: string; color: string }>;
};

export type BenefitIcon = "calendar" | "progress";

export type WhyChooseContent = {
  header: SectionHeaderContent;
  benefits: Array<{
    title: string;
    text: string;
    color: string;
    icon: BenefitIcon;
  }>;
  gallery: string[];
};

export type TestimonialContent = {
  name: string;
  role?: string;
  quote: string;
};

export type TestimonialsSection = {
  header: SectionHeaderContent;
  items: TestimonialContent[];
};

export type NewsletterContent = {
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
};

export type CTAContent = {
  title: string;
  buttons: Array<{
    label: string;
    href: string;
    style: "primary" | "secondary";
  }>;
};

export type LandingContent = {
  hero: HeroContent;
  popularCourses: PopularCoursesContent;
  about: AboutContent;
  whyChoose: WhyChooseContent;
  testimonials: TestimonialsSection;
  newsletter: NewsletterContent;
  cta: CTAContent;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type LandingContentInput = DeepPartial<LandingContent>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      const baseValue = (base as Record<string, unknown>)[key];
      const overrideValue = (override as Record<string, unknown>)[key];
      result[key] = deepMerge(baseValue as unknown as T[keyof T], overrideValue as DeepPartial<T[keyof T]>);
    }
    return result as T;
  }

  return (override ?? base) as T;
}

export const landingSlug = "main";

export const defaultLandingContent: LandingContent = {
  hero: {
    eyebrow: "Matematika & Programming",
    title: "Kuasai Matematika &",
    highlight: "Programming",
    description:
      "Materi terstruktur untuk SD, SMP, SMA, dan jalur programming. Tersedia kelas online/offline, mentor yang standby, serta dashboard progres untuk memantau perkembangan belajar.",
    ctaLabel: "Get started",
    stats: [
      { label: "Materi Matematika & Coding", value: "120+" },
      { label: "Guru & Mentor", value: "85+" },
      { label: "Siswa aktif", value: "24k+" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80",
    heroAvatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    badge: {
      title: "Kurikulum Matematika",
      subtitle: "SD - SMA",
      description: "Numerasi & logika terapan",
    },
    mentor: {
      name: "Mentor Dini",
      role: "Guru Matematika & Coding",
      experience: "545+ jam mengajar",
    },
  },
  popularCourses: {
    header: {
      eyebrow: "Pilihan jalur",
      title: "Fokus Matematika & Programming",
      description:
        "Kurikulum ringkas untuk siswa SD, SMP, SMA serta jalur programming pemula. Pilih mode online atau offline sesuai kebutuhan.",
    },
    featureCards: [
      {
        title: "Matematika SD hingga SMA",
        description: "Numerasi dasar, aljabar, geometri, dan persiapan ujian.",
        color: "bg-mint",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Programming Dasar & Lanjutan",
        description: "Logika, algoritma, hingga proyek web sederhana.",
        color: "bg-cloud",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      },
    ],
    sliderCards: [
      {
        title: "Aljabar & Geometri",
        subtitle: "Level SMP/SMA - kelas hybrid",
        cta: "Gabung kelas",
        students: "180 siswa",
        bg: "bg-peach",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Algoritma & Web Dasar",
        subtitle: "Pemula - HTML, CSS, JS",
        cta: "Gabung kelas",
        students: "126 siswa",
        bg: "bg-sand",
        image:
          "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  about: {
    header: {
      eyebrow: "Tentang platform",
      title: "Dipakai Admin, Guru, dan Siswa",
      description:
        "Admin mengelola CMS & kurikulum, guru mengunggah materi dan jadwal kelas, siswa memantau progres dan hadir di kelas online/offline.",
    },
    collage: [
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80",
    ],
    bullets: [
      {
        text: "Admin dapat membuat kursus, menjadwalkan kelas, dan mengatur akses guru.",
        color: "bg-orange",
      },
      {
        text: "Guru mengunggah bahan ajar, memberi tugas, dan memonitor kelas yang dibimbing.",
        color: "bg-mint-dark",
      },
      {
        text: "Siswa melihat progres per modul, jadwal berikutnya, dan materi yang siap dipelajari.",
        color: "bg-charcoal",
      },
    ],
  },
  whyChoose: {
    header: {
      eyebrow: "Alasan",
      title: "Kenapa Memilih Kursus Kami",
      description:
        "Pendekatan terstruktur untuk Matematika dan Programming, mentor responsif, dan progress tracker bawaan.",
    },
    benefits: [
      {
        title: "Jadwal Fleksibel",
        text: "Pilih kelas online/offline sesuai waktu kosongmu.",
        color: "bg-sand",
        icon: "calendar",
      },
      {
        title: "Pantau Progres",
        text: "Dashboard siswa menampilkan progres modul, nilai, dan tugas.",
        color: "bg-mint",
        icon: "progress",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
    ],
  },
  testimonials: {
    header: {
      eyebrow: "Testimoni",
      title: "Cerita siswa bersama Kak Ghaida",
      description: "Pendapat siswa dan orang tua setelah mengikuti sesi matematika maupun pemrograman.",
    },
    items: [
      {
        name: "Siswa SMA",
        role: "Kelas online",
        quote:
          "Selama diajar oleh Kak Ghaida nilai saya naik secara drastis. Terutama pada saat pembelajaran semasa covid. Materi yang diajarkanpun sangat membantu saya dalam mengerjakan ulangan karena penjelasannya yang sangat jelas dan mudah untuk dipahami.",
      },
      {
        name: "Siswa SMP",
        role: "Pendampingan ujian",
        quote:
          "Setelah les bersama Kak Ghaida, pemahaman saya terhadap materi sekolah meningkat, terutama pada bagian yang sebelumnya saya anggap sulit. Penjelasan Kak Ghaida yang jelas, sabar, dan contoh-contoh latihan yang diberikan sangat membantu saya memahami materi dengan lebih cepat.",
      },
      {
        name: "Siswa privat",
        role: "Belajar tatap muka",
        quote:
          "Pengalaman saya selama diajarkan oleh Kak Ghaida yaitu seru dan menyenangkan. Karena selama proses pembelajaran cara penyampaian Kak Ghaida sangat jelas dan rinci, sehingga hampir jarang saya mengalami kesulitan untuk memahami apa yang Kak Ghaida sedang jelaskan.",
      },
      {
        name: "Orang tua siswa",
        role: "Program intensif",
        quote:
          "Ibu ghida sabar mengajarnya jadi saya bisa memahami lebih mudah tanpa tekanan.",
      },
    ],
  },
  newsletter: {
    title: "Dapatkan Silabus & Jadwal Terbaru",
    description: "Kami kirim info kelas Matematika dan Programming setiap pekan.",
    placeholder: "Email",
    buttonLabel: "Kirim",
  },
  cta: {
    title: "Sudah punya akun?",
    buttons: [
      { label: "Login", href: "/login", style: "primary" },
      { label: "Buka Dashboard", href: "/dashboard", style: "secondary" },
    ],
  },
};

export function mergeLandingContent(input?: LandingContentInput): LandingContent {
  return deepMerge(defaultLandingContent, input);
}
