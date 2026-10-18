"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import { Toaster, toast } from "react-hot-toast";
import MasjidTV from "@/components/masjid/MasjidTV";
import { useLocationSelect } from "@/components/masjid/useLocationSelect";
import { selectStyles, type Location } from "@/components/masjid/selectStyles";
import type { TvTheme } from "@/components/masjid/theme";

const STORAGE_KEY = "awas-imsak-masjid";

interface Saved {
  name: string;
  location: Location;
  theme?: TvTheme;
}

const Masjid = () => {
  const { locations, selectedLocation, setSelectedLocation, isLoading } =
    useLocationSelect();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState<TvTheme>("dark");
  const [active, setActive] = useState<Saved | null>(null);
  const [ready, setReady] = useState(false);

  // Kalau sebelumnya sudah pernah diatur, langsung tampilkan TV
  // (berguna agar layar TV yang di-refresh tidak kembali ke form).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        if (saved?.name && saved?.location?.value) {
          setName(saved.name);
          setTheme(saved.theme === "light" ? "light" : "dark");
          setSelectedLocation(saved.location);
          setActive(saved);
        }
      }
    } catch {
      /* localStorage tidak tersedia */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Nama masjid / mushola wajib diisi", { id: "nama-kosong" });
      return;
    }
    if (!selectedLocation) {
      toast.error("Pilih wilayah masjid / mushola terlebih dahulu", {
        id: "wilayah-kosong",
      });
      return;
    }
    const saved: Saved = { name: trimmed, location: selectedLocation, theme };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* diabaikan */
    }
    setActive(saved);
  };

  const handleThemeChange = (next: TvTheme) => {
    setTheme(next);
    setActive((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, theme: next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        /* diabaikan */
      }
      return updated;
    });
  };

  const handleExit = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* diabaikan */
    }
    setActive(null);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  if (!ready) return null;

  if (active) {
    return (
      <MasjidTV
        masjidName={active.name}
        location={active.location}
        theme={theme}
        onThemeChange={handleThemeChange}
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="bodi-masjid flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <Toaster position="top-left" reverseOrder={false} />
      <div className="w-full max-w-[34rem]">
        <Link href="/" className="mb-4 inline-block">
          <p className="rounded-full border border-[#3e664e] bg-[#0d1811] px-3 py-1 text-[13px] text-white hover:bg-[#1e3828]">
            ⬅ Back to Home
          </p>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-8"
        >
          <p className="monas inline-block self-center bg-gradient-to-r from-[#4f772d] to-[#aad576] bg-clip-text text-center text-[2.4rem] leading-tight text-transparent drop-shadow-xl sm:text-[3rem]">
            TV Masjid / Mushola
          </p>
          <p className="mb-6 mt-1 text-center text-sm text-white/70">
            Tampilkan jadwal sholat khusus untuk masjid atau mushola Anda di
            layar TV.
          </p>

          <label
            htmlFor="nama-masjid"
            className="poppins-extrabold mb-1.5 text-base"
          >
            Nama Masjid / Mushola:
          </label>
          <input
            id="nama-masjid"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Contoh: Masjid Nurul Himmah"
            className="poppins-regular mb-4 h-[46px] rounded-[14px] border border-white/10 bg-white/5 px-3 text-white outline-none placeholder:text-white/50 focus:border-[#aad576]/60 focus:shadow-[0_0_0_3px_rgba(170,213,118,0.15)]"
          />

          <label
            htmlFor="wilayah"
            className="poppins-extrabold mb-1.5 text-base"
          >
            Pilih Wilayah:
          </label>
          <div className="relative z-[999] mb-6">
            <Select
              inputId="wilayah"
              options={locations}
              value={selectedLocation}
              onChange={(selected) => setSelectedLocation(selected)}
              placeholder={
                isLoading ? "Mendeteksi lokasi..." : "Cari lokasi..."
              }
              isDisabled={isLoading}
              isClearable
              styles={selectStyles}
              menuPlacement="auto"
              maxMenuHeight={220}
              className="poppins-regular"
            />
          </div>

          <p className="poppins-extrabold mb-1.5 text-base">Tampilan TV:</p>
          <div
            role="radiogroup"
            aria-label="Tampilan TV"
            className="mb-6 grid grid-cols-2 gap-2"
          >
            {(
              [
                { value: "dark", label: "Mode Gelap", hint: "Hijau (standar)" },
                { value: "light", label: "Mode Terang", hint: "Putih, teks hijau" },
              ] as const
            ).map(({ value, label, hint }) => {
              const selected = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(value)}
                  className={`poppins-regular flex flex-col items-center rounded-[14px] border px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#aad576] ${
                    selected
                      ? "border-[#aad576]/70 bg-[#aad576]/15 text-white shadow-[0_0_0_3px_rgba(170,213,118,0.15)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-[#aad576]/40"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <span
                      aria-hidden="true"
                      className="inline-block h-3.5 w-3.5 rounded-full border border-white/30"
                      style={{
                        background: value === "dark" ? "#1e3828" : "#ffffff",
                      }}
                    />
                    {label}
                  </span>
                  <span className="text-[11px] text-white/50">{hint}</span>
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="active-box active-shadow h-11 rounded-full border border-white/15 bg-black/60 px-6 text-sm text-white transition-colors hover:border-[#aad576]/60 hover:bg-[#aad576]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#aad576]"
          >
            Tampilkan
          </button>
          <p className="mt-3 text-center text-[11px] text-white/50">
            Arahkan kursor ke pojok kiri bawah layar TV untuk tombol Keluar dan
            Layar penuh.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Masjid;
