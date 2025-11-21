"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BenefitIcon,
  LandingContent,
  LandingContentInput,
  defaultLandingContent,
  mergeLandingContent,
} from "@/lib/landing-content";
import {
  fetchLandingContentPublic,
  saveLandingContentClient,
  uploadLandingImage,
} from "@/lib/api-client";

type StatusState = { message?: string; error?: string };

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange";
const labelClass = "text-xs font-semibold uppercase tracking-[0.15em] text-muted";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type ImageUploadInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  note?: string;
  folder: string;
  token: string | null;
  disabled?: boolean;
  onChange: (url: string) => void;
  onUploadingChange: (active: boolean) => void;
  setStatus: Dispatch<SetStateAction<StatusState>>;
};

function ImageUploadInput({
  label,
  value,
  placeholder,
  note,
  folder,
  token,
  disabled,
  onChange,
  onUploadingChange,
  setStatus,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!token) {
      setStatus({ error: "Perlu login sebagai admin untuk upload gambar." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setStatus({ error: "Ukuran gambar maksimal 5MB." });
      return;
    }

    setUploading(true);
    onUploadingChange(true);
    try {
      const res = await uploadLandingImage(file, { token, folder });
      onChange(res.url);
      setStatus({ message: "Gambar berhasil diunggah." });
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : "Upload gambar gagal" });
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        {note ? <span className="text-[11px] text-muted">{note}</span> : null}
      </div>
      <div className="space-y-2">
        <label className="flex flex-col gap-1 rounded-xl border border-dashed border-line p-3 text-xs text-muted">
          <span className="font-semibold text-charcoal">
            {uploading ? "Mengunggah..." : "Upload gambar"}
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              void handleFile(file);
              e.target.value = "";
            }}
          />
          <span>PNG/JPG maks 5MB</span>
        </label>
        {value ? (
          <div className="flex items-center gap-3 rounded-2xl border border-line p-2">
            <img src={value} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <span className="truncate text-xs text-charcoal" title={value}>
              {value}
            </span>
          </div>
        ) : null}
        <input
          className={inputClass}
          placeholder={placeholder || "Atau tempel URL gambar"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function LandingContentEditor() {
  const { token } = useAuth();
  const [content, setContent] = useState<LandingContent>(defaultLandingContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [status, setStatus] = useState<StatusState>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [source, setSource] = useState<"database" | "fallback">("fallback");
  const isUploading = uploadingCount > 0;

  const updatedLabel = useMemo(() => {
    if (!updatedAt) return "Belum ada data";
    const dt = new Date(updatedAt);
    return dt.toLocaleString();
  }, [updatedAt]);

  const handleUploadingChange = (active: boolean) => {
    setUploadingCount((prev) => {
      const next = active ? prev + 1 : Math.max(0, prev - 1);
      return next;
    });
  };

  const loadContent = async () => {
    setLoading(true);
    setStatus({});
    try {
      const res = await fetchLandingContentPublic();
      const merged = mergeLandingContent(res.content as LandingContentInput);
      setContent(merged);
      setUpdatedAt((res as { updated_at?: string | null })?.updated_at ?? null);
      setSource((res as { source?: "database" | "fallback" })?.source ?? "fallback");
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : "Gagal memuat konten" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const saveContent = async () => {
    if (!token) {
      setStatus({ error: "Perlu login sebagai admin untuk menyimpan." });
      return;
    }
    setSaving(true);
    setStatus({});
    try {
      const res = await saveLandingContentClient(content, { token });
      setContent(mergeLandingContent((res as { content?: LandingContentInput }).content));
      setUpdatedAt((res as { updated_at?: string | null })?.updated_at ?? null);
      setSource("database");
      setStatus({ message: "Konten landing tersimpan." });
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : "Gagal menyimpan konten" });
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: [...prev.hero.stats, { label: "", value: "" }] },
    }));
  };

  const updateStat = (index: number, key: "label" | "value", value: string) => {
    setContent((prev) => {
      const stats = [...prev.hero.stats];
      stats[index] = { ...stats[index], [key]: value };
      return { ...prev, hero: { ...prev.hero, stats } };
    });
  };

  const removeStat = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: prev.hero.stats.filter((_, i) => i !== index) },
    }));
  };

  const addFeatureCard = () => {
    setContent((prev) => ({
      ...prev,
      popularCourses: {
        ...prev.popularCourses,
        featureCards: [
          ...prev.popularCourses.featureCards,
          { title: "", description: "", color: "bg-cloud", image: "" },
        ],
      },
    }));
  };

  const updateFeatureCard = (
    index: number,
    key: "title" | "description" | "color" | "image",
    value: string
  ) => {
    setContent((prev) => {
      const featureCards = [...prev.popularCourses.featureCards];
      featureCards[index] = { ...featureCards[index], [key]: value };
      return { ...prev, popularCourses: { ...prev.popularCourses, featureCards } };
    });
  };

  const removeFeatureCard = (index: number) => {
    setContent((prev) => ({
      ...prev,
      popularCourses: {
        ...prev.popularCourses,
        featureCards: prev.popularCourses.featureCards.filter((_, i) => i !== index),
      },
    }));
  };

  const addSliderCard = () => {
    setContent((prev) => ({
      ...prev,
      popularCourses: {
        ...prev.popularCourses,
        sliderCards: [
          ...prev.popularCourses.sliderCards,
          { title: "", subtitle: "", cta: "", students: "", bg: "bg-peach", image: "" },
        ],
      },
    }));
  };

  const updateSliderCard = (
    index: number,
    key: "title" | "subtitle" | "cta" | "students" | "bg" | "image",
    value: string
  ) => {
    setContent((prev) => {
      const sliderCards = [...prev.popularCourses.sliderCards];
      sliderCards[index] = { ...sliderCards[index], [key]: value };
      return { ...prev, popularCourses: { ...prev.popularCourses, sliderCards } };
    });
  };

  const removeSliderCard = (index: number) => {
    setContent((prev) => ({
      ...prev,
      popularCourses: {
        ...prev.popularCourses,
        sliderCards: prev.popularCourses.sliderCards.filter((_, i) => i !== index),
      },
    }));
  };

  const updateCollageImage = (index: number, value: string) => {
    setContent((prev) => {
      const collage = [...prev.about.collage];
      collage[index] = value;
      return { ...prev, about: { ...prev.about, collage } };
    });
  };

  const addBullet = () => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, bullets: [...prev.about.bullets, { text: "", color: "bg-cloud" }] },
    }));
  };

  const updateBullet = (index: number, key: "text" | "color", value: string) => {
    setContent((prev) => {
      const bullets = [...prev.about.bullets];
      bullets[index] = { ...bullets[index], [key]: value };
      return { ...prev, about: { ...prev.about, bullets } };
    });
  };

  const removeBullet = (index: number) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, bullets: prev.about.bullets.filter((_, i) => i !== index) },
    }));
  };

  const addBenefit = () => {
    setContent((prev) => ({
      ...prev,
      whyChoose: {
        ...prev.whyChoose,
        benefits: [
          ...prev.whyChoose.benefits,
          { title: "", text: "", color: "bg-cloud", icon: "calendar" as BenefitIcon },
        ],
      },
    }));
  };

  const updateBenefit = (
    index: number,
    key: "title" | "text" | "color" | "icon",
    value: string
  ) => {
    setContent((prev) => {
      const benefits = [...prev.whyChoose.benefits];
      benefits[index] = { ...benefits[index], [key]: value };
      return { ...prev, whyChoose: { ...prev.whyChoose, benefits } };
    });
  };

  const removeBenefit = (index: number) => {
    setContent((prev) => ({
      ...prev,
      whyChoose: {
        ...prev.whyChoose,
        benefits: prev.whyChoose.benefits.filter((_, i) => i !== index),
      },
    }));
  };

  const updateGallery = (index: number, value: string) => {
    setContent((prev) => {
      const gallery = [...prev.whyChoose.gallery];
      gallery[index] = value;
      return { ...prev, whyChoose: { ...prev.whyChoose, gallery } };
    });
  };

  const addTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [...prev.testimonials.items, { name: "", role: "", quote: "" }],
      },
    }));
  };

  const updateTestimonial = (index: number, key: "name" | "role" | "quote", value: string) => {
    setContent((prev) => {
      const items = [...prev.testimonials.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, testimonials: { ...prev.testimonials, items } };
    });
  };

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((_, i) => i !== index),
      },
    }));
  };

  const addCTAButton = () => {
    setContent((prev) => ({
      ...prev,
      cta: { ...prev.cta, buttons: [...prev.cta.buttons, { label: "", href: "", style: "primary" }] },
    }));
  };

  const updateCTAButton = (
    index: number,
    key: "label" | "href" | "style",
    value: string
  ) => {
    setContent((prev) => {
      const buttons = [...prev.cta.buttons];
      buttons[index] = { ...buttons[index], [key]: value as "primary" | "secondary" };
      return { ...prev, cta: { ...prev.cta, buttons } };
    });
  };

  const removeCTAButton = (index: number) => {
    setContent((prev) => ({
      ...prev,
      cta: { ...prev.cta, buttons: prev.cta.buttons.filter((_, i) => i !== index) },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Landing CMS</p>
          <h2 className="text-2xl font-semibold text-charcoal">Kelola konten landing page</h2>
          <p className="text-xs text-muted">
            Terakhir diperbarui: {updatedLabel} ({source === "database" ? "Supabase" : "kode bawaan"}).
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadContent}
            className="rounded-pill bg-cloud px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-60"
            disabled={loading || saving || isUploading}
          >
            Muat ulang
          </button>
          <button
            type="button"
            onClick={saveContent}
            className="rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-60"
            disabled={saving || loading || isUploading}
          >
            {saving ? "Menyimpan..." : isUploading ? "Menunggu upload..." : "Simpan perubahan"}
          </button>
        </div>
      </div>

      {status.error && (
        <div className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{status.error}</div>
      )}
      {status.message && (
        <div className="rounded-xl bg-mint px-3 py-2 text-sm text-charcoal">{status.message}</div>
      )}
      {isUploading && (
        <div className="rounded-xl bg-cloud px-3 py-2 text-sm text-charcoal">
          Mengunggah gambar... tunggu selesai sebelum menyimpan.
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-5 text-sm text-muted shadow-card ring-1 ring-line">
          Memuat konten landing...
        </div>
      ) : (
        <div className="grid gap-6">
          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Hero</h3>
              <span className="text-xs text-muted">Judul utama, statistik, dan gambar</span>
            </header>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className={labelClass}>Eyebrow</span>
                <input
                  className={inputClass}
                  value={content.hero.eyebrow}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>CTA label</span>
                <input
                  className={inputClass}
                  value={content.hero.ctaLabel}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaLabel: e.target.value } })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Highlight</span>
                <input
                  className={inputClass}
                  value={content.hero.highlight}
                  onChange={(e) =>
                    setContent({ ...content, hero: { ...content.hero, highlight: e.target.value } })
                  }
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className={labelClass}>Deskripsi</span>
                <textarea
                  className={`${inputClass} h-24`}
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent({ ...content, hero: { ...content.hero, description: e.target.value } })
                  }
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ImageUploadInput
                label="Hero image"
                value={content.hero.heroImage}
                placeholder="Upload atau tempel URL hero"
                folder="hero"
                token={token}
                setStatus={setStatus}
                onUploadingChange={handleUploadingChange}
                onChange={(url) =>
                  setContent({ ...content, hero: { ...content.hero, heroImage: url } })
                }
              />
              <ImageUploadInput
                label="Hero avatar"
                value={content.hero.heroAvatar}
                placeholder="Upload atau tempel URL avatar"
                folder="hero-avatar"
                token={token}
                setStatus={setStatus}
                onUploadingChange={handleUploadingChange}
                onChange={(url) =>
                  setContent({ ...content, hero: { ...content.hero, heroAvatar: url } })
                }
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Badge title</span>
                <input
                  className={inputClass}
                  value={content.hero.badge.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: { ...content.hero.badge, title: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Badge subtitle</span>
                <input
                  className={inputClass}
                  value={content.hero.badge.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: { ...content.hero.badge, subtitle: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Badge description</span>
                <input
                  className={inputClass}
                  value={content.hero.badge.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: { ...content.hero.badge, description: e.target.value } },
                    })
                  }
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Mentor name</span>
                <input
                  className={inputClass}
                  value={content.hero.mentor.name}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, mentor: { ...content.hero.mentor, name: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Mentor role</span>
                <input
                  className={inputClass}
                  value={content.hero.mentor.role}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, mentor: { ...content.hero.mentor, role: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Mentor pengalaman</span>
                <input
                  className={inputClass}
                  value={content.hero.mentor.experience}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...content.hero,
                        mentor: { ...content.hero.mentor, experience: e.target.value },
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Statistik</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addStat}
                >
                  Tambah stat
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.hero.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <div className="grid gap-2">
                      <input
                        className={inputClass}
                        placeholder="Nilai"
                        value={stat.value}
                        onChange={(e) => updateStat(index, "value", e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) => updateStat(index, "label", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeStat(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Popular courses</h3>
              <span className="text-xs text-muted">Kartu unggulan dan slider</span>
            </header>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1 md:col-span-1">
                <span className={labelClass}>Eyebrow</span>
                <input
                  className={inputClass}
                  value={content.popularCourses.header.eyebrow || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      popularCourses: {
                        ...content.popularCourses,
                        header: { ...content.popularCourses.header, eyebrow: e.target.value },
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-1 md:col-span-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.popularCourses.header.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      popularCourses: {
                        ...content.popularCourses,
                        header: { ...content.popularCourses.header, title: e.target.value },
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-1 md:col-span-1">
                <span className={labelClass}>Deskripsi</span>
                <input
                  className={inputClass}
                  value={content.popularCourses.header.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      popularCourses: {
                        ...content.popularCourses,
                        header: { ...content.popularCourses.header, description: e.target.value },
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Feature cards</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addFeatureCard}
                >
                  Tambah kartu
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.popularCourses.featureCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Judul"
                      value={card.title}
                      onChange={(e) => updateFeatureCard(index, "title", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Deskripsi"
                      value={card.description}
                      onChange={(e) => updateFeatureCard(index, "description", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Warna (class)"
                      value={card.color}
                      onChange={(e) => updateFeatureCard(index, "color", e.target.value)}
                    />
                    <ImageUploadInput
                      label="Gambar"
                      value={card.image}
                      placeholder="Upload atau tempel URL gambar"
                      folder={`feature-card-${index + 1}`}
                      token={token}
                      setStatus={setStatus}
                      onUploadingChange={handleUploadingChange}
                      onChange={(url) => updateFeatureCard(index, "image", url)}
                    />
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeFeatureCard(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Slider cards</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addSliderCard}
                >
                  Tambah slider
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.popularCourses.sliderCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Judul"
                      value={card.title}
                      onChange={(e) => updateSliderCard(index, "title", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Subjudul"
                      value={card.subtitle}
                      onChange={(e) => updateSliderCard(index, "subtitle", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="CTA"
                      value={card.cta}
                      onChange={(e) => updateSliderCard(index, "cta", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Students"
                      value={card.students}
                      onChange={(e) => updateSliderCard(index, "students", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Warna (class)"
                      value={card.bg}
                      onChange={(e) => updateSliderCard(index, "bg", e.target.value)}
                    />
                    <ImageUploadInput
                      label="Gambar"
                      value={card.image}
                      placeholder="Upload atau tempel URL gambar"
                      folder={`slider-card-${index + 1}`}
                      token={token}
                      setStatus={setStatus}
                      onUploadingChange={handleUploadingChange}
                      onChange={(url) => updateSliderCard(index, "image", url)}
                    />
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeSliderCard(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">About</h3>
              <span className="text-xs text-muted">Galeri dan bullet</span>
            </header>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Eyebrow</span>
                <input
                  className={inputClass}
                  value={content.about.header.eyebrow || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, header: { ...content.about.header, eyebrow: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.about.header.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, header: { ...content.about.header, title: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Deskripsi</span>
                <input
                  className={inputClass}
                  value={content.about.header.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        header: { ...content.about.header, description: e.target.value },
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Collage images</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.about.collage.map((img, index) => (
                  <ImageUploadInput
                    key={`collage-${index}`}
                    label={`Gambar ${index + 1}`}
                    value={img}
                    folder={`about-collage-${index + 1}`}
                    token={token}
                    setStatus={setStatus}
                    onUploadingChange={handleUploadingChange}
                    onChange={(url) => updateCollageImage(index, url)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Bullets</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addBullet}
                >
                  Tambah bullet
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.about.bullets.map((bullet, index) => (
                  <div key={`${bullet.text}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Teks"
                      value={bullet.text}
                      onChange={(e) => updateBullet(index, "text", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Warna (class)"
                      value={bullet.color}
                      onChange={(e) => updateBullet(index, "color", e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeBullet(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Why choose</h3>
              <span className="text-xs text-muted">Benefit dan galeri</span>
            </header>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Eyebrow</span>
                <input
                  className={inputClass}
                  value={content.whyChoose.header.eyebrow || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: { ...content.whyChoose, header: { ...content.whyChoose.header, eyebrow: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.whyChoose.header.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: { ...content.whyChoose, header: { ...content.whyChoose.header, title: e.target.value } },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Deskripsi</span>
                <input
                  className={inputClass}
                  value={content.whyChoose.header.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: {
                        ...content.whyChoose,
                        header: { ...content.whyChoose.header, description: e.target.value },
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Benefits</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addBenefit}
                >
                  Tambah benefit
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.whyChoose.benefits.map((benefit, index) => (
                  <div key={`${benefit.title}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Judul"
                      value={benefit.title}
                      onChange={(e) => updateBenefit(index, "title", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Deskripsi"
                      value={benefit.text}
                      onChange={(e) => updateBenefit(index, "text", e.target.value)}
                    />
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Warna (class)"
                        value={benefit.color}
                        onChange={(e) => updateBenefit(index, "color", e.target.value)}
                      />
                      <select
                        className={inputClass}
                        value={benefit.icon}
                        onChange={(e) => updateBenefit(index, "icon", e.target.value)}
                      >
                        <option value="calendar">Calendar</option>
                        <option value="progress">Progress</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeBenefit(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className={labelClass}>Galeri</span>
              <div className="grid gap-3 md:grid-cols-2">
                {content.whyChoose.gallery.map((img, index) => (
                  <ImageUploadInput
                    key={`gallery-${index}`}
                    label={`Gambar ${index + 1}`}
                    value={img}
                    folder={`why-gallery-${index + 1}`}
                    token={token}
                    setStatus={setStatus}
                    onUploadingChange={handleUploadingChange}
                    onChange={(url) => updateGallery(index, url)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Testimonials</h3>
              <span className="text-xs text-muted">Cerita siswa sebelum footer</span>
            </header>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Eyebrow</span>
                <input
                  className={inputClass}
                  value={content.testimonials.header.eyebrow || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonials: {
                        ...content.testimonials,
                        header: { ...content.testimonials.header, eyebrow: e.target.value },
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.testimonials.header.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonials: {
                        ...content.testimonials,
                        header: { ...content.testimonials.header, title: e.target.value },
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Deskripsi</span>
                <input
                  className={inputClass}
                  value={content.testimonials.header.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      testimonials: {
                        ...content.testimonials,
                        header: { ...content.testimonials.header, description: e.target.value },
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Daftar testimoni</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addTestimonial}
                >
                  Tambah testimoni
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.testimonials.items.map((item, index) => (
                  <div key={`${item.name || "testi"}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Nama / sebutan"
                      value={item.name}
                      onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Peran (opsional)"
                      value={item.role || ""}
                      onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                    />
                    <textarea
                      className={`${inputClass} h-28`}
                      placeholder="Kutipan testimoni"
                      value={item.quote}
                      onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeTestimonial(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Newsletter</h3>
              <span className="text-xs text-muted">Teks ajakan</span>
            </header>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className={labelClass}>Judul</span>
                <input
                  className={inputClass}
                  value={content.newsletter.title}
                  onChange={(e) =>
                    setContent({ ...content, newsletter: { ...content.newsletter, title: e.target.value } })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Deskripsi</span>
                <input
                  className={inputClass}
                  value={content.newsletter.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      newsletter: { ...content.newsletter, description: e.target.value },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Placeholder</span>
                <input
                  className={inputClass}
                  value={content.newsletter.placeholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      newsletter: { ...content.newsletter, placeholder: e.target.value },
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Button label</span>
                <input
                  className={inputClass}
                  value={content.newsletter.buttonLabel}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      newsletter: { ...content.newsletter, buttonLabel: e.target.value },
                    })
                  }
                />
              </label>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">CTA akhir</h3>
              <span className="text-xs text-muted">Tombol login/dashboard</span>
            </header>
            <label className="space-y-1">
              <span className={labelClass}>Judul</span>
              <input
                className={inputClass}
                value={content.cta.title}
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Tombol</span>
                <button
                  type="button"
                  className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
                  onClick={addCTAButton}
                >
                  Tambah tombol
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {content.cta.buttons.map((btn, index) => (
                  <div key={`${btn.label}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
                    <input
                      className={inputClass}
                      placeholder="Label"
                      value={btn.label}
                      onChange={(e) => updateCTAButton(index, "label", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Href"
                      value={btn.href}
                      onChange={(e) => updateCTAButton(index, "href", e.target.value)}
                    />
                    <select
                      className={inputClass}
                      value={btn.style}
                      onChange={(e) => updateCTAButton(index, "style", e.target.value)}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => removeCTAButton(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
