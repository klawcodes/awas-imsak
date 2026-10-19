"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import AnalogClock from "./AnalogClock";
import { pickRandomMosqueImage } from "./mosqueImages";
import type { Location } from "./selectStyles";
import { THEMES, type ThemeTokens, type TvTheme } from "./theme";

interface Props {
  masjidName: string;
  location: Location;
  theme: TvTheme;
  onThemeChange: (theme: TvTheme) => void;
  onExit: () => void;
}

type Schedule = Record<string, string>;

interface AdzanState {
  label: string;
  delta: number;
  total: number;
}

const TICKER_MESSAGES = [
  "Mohon matikan ponsel atau aktifkan mode senyap",
  "Luruskan dan rapatkan shaf",
  "Jagalah kebersihan masjid",
];

const FONT = '"Poppins", "Segoe UI", Helvetica, Arial, sans-serif';

// Layar hitung mundur adzan muncul sekian detik sebelum waktu masuk,
// dan bertahan sebentar sesudahnya.
const ADZAN_LEAD_SECONDS = 5 * 60;
const ADZAN_HOLD_SECONDS = 60;
const ADZAN_KEYS = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];

// Lama mode tes layar adzan (detik hitung mundur + masa tahan sesudahnya).
const DEMO_COUNTDOWN_SECONDS = 20;
const DEMO_TOTAL_SECONDS = DEMO_COUNTDOWN_SECONDS + ADZAN_HOLD_SECONDS;

// Saklar tes: true = tekan tombol "H" untuk memicu layar adzan + tirai
// (dan tombol "Tes layar adzan" tampil). false = hotkey & tombol nonaktif.
// Ubah ke false kalau sudah selesai mengetes.
const ENABLE_DEMO_HOTKEY = true;

const pad = (n: number) => n.toString().padStart(2, "0");

function toSeconds(hhmm: string | undefined): number | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 3600 + m * 60;
}

/* ---------- Ikon waktu sholat (SVG, warna mengikuti teks) ---------- */
function PrayerIcon({ name }: { name: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      {name === "subuh" && (
        <g {...p}>
          <path d="M18 44a14 14 0 0 1 28 0" />
          <path d="M6 44h52M20 54h24" />
          <path d="M32 14v7M13 25l5 5M51 25l-5 5M7 38h5M52 38h5" />
        </g>
      )}
      {name === "terbit" && (
        <g {...p}>
          <path d="M18 40a14 14 0 0 1 28 0" />
          <path d="M6 40h52" />
          <path d="M32 58V46M26 52l6-6 6 6" />
          <path d="M32 10v7M13 21l5 5M51 21l-5 5" />
        </g>
      )}
      {name === "dzuhur" && (
        <g {...p}>
          <circle cx="32" cy="32" r="10" />
          <path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5" />
        </g>
      )}
      {name === "ashar" && (
        <g {...p}>
          <circle cx="40" cy="26" r="9" />
          <path d="M40 6v5M58 26h-5M53 13l-3 3M53 39l-3-3M27 13l3 3" />
          <path d="M6 36h22M10 45h24M6 54h18" />
        </g>
      )}
      {name === "maghrib" && (
        <g {...p}>
          <path d="M18 40a14 14 0 0 1 28 0" />
          <path d="M6 40h52" />
          <path d="M32 46v12M26 52l6 6 6-6" />
          <path d="M32 10v7M13 21l5 5M51 21l-5 5" />
        </g>
      )}
      {name === "isya" && (
        <path
          d="M44 8A24 24 0 1 0 56 44A19 19 0 0 1 44 8Z"
          fill="currentColor"
          stroke="none"
        />
      )}
    </svg>
  );
}

function MosqueBadge({ t }: { t: ThemeTokens }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={t.badgeFill}
        stroke={t.badgeStroke}
        strokeWidth="2"
      />
      <path d="M17 50V37a15 15 0 0 1 30 0v13Z" fill={t.badgeBuilding} />
      <path d="M27 50v-7a5 5 0 0 1 10 0v7Z" fill={t.badgeDoor} />
      <path d="M34 11a6 6 0 1 0 3 10a4.6 4.6 0 0 1-3-10Z" fill={t.badgeMoon} />
      <path d="M32 21v6" stroke={t.badgeMoon} strokeWidth="2.4" />
    </svg>
  );
}

function ClockBadgeIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <circle
        cx="24"
        cy="24"
        r="17"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
      <path
        d="M24 13v11l7 4"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlarmIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <circle
        cx="24"
        cy="26"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M24 17v10l6 4M7 12l7-6M41 12l-7-6M10 41l4-4M38 41l-4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MasjidTV({
  masjidName,
  location,
  theme,
  onThemeChange,
  onExit,
}: Props) {
  const t = THEMES[theme];
  const [now, setNow] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  // Waktu mulai mode tes layar adzan (ms), null jika tidak aktif.
  const [demoStart, setDemoStart] = useState<number | null>(null);

  // Gambar masjid dipilih acak sekali saat TV dibuka.
  useEffect(() => {
    setBgImage(pickRandomMosqueImage());
  }, []);

  // Tick dijadwalkan tepat di batas detik berikutnya (bukan setInterval 1000ms
  // yang melenceng), supaya angka detik tidak sesekali terlewat / ganda.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(timer);
  }, []);

  // Hotkey "H": memicu layar adzan mode tes (hanya jika ENABLE_DEMO_HOTKEY true).
  useEffect(() => {
    if (!ENABLE_DEMO_HOTKEY) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.toLowerCase() !== "h") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      )
        return;
      setDemoStart(Date.now());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Ambil jadwal; ulangi otomatis saat tanggal berganti.
  const dayKey = now.toDateString();
  useEffect(() => {
    let cancelled = false;
    const d = new Date();
    const url = `https://api.myquran.com/v2/sholat/jadwal/${location.value}/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.data?.jadwal) setSchedule(data.data.jadwal);
      })
      .catch((e) => console.error("Error fetching prayer schedule:", e));
    return () => {
      cancelled = true;
    };
  }, [location.value, dayKey]);

  const isFriday = now.getDay() === 5;

  const rows = useMemo(
    () => [
      { key: "subuh", label: "Subuh" },
      { key: "terbit", label: "Terbit" },
      { key: "dzuhur", label: isFriday ? "Jumat" : "Dzuhur" },
      { key: "ashar", label: "Ashar" },
      { key: "maghrib", label: "Maghrib" },
      { key: "isya", label: "Isya" },
    ],
    [isFriday],
  );

  const nowSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Waktu sholat berikutnya + hitung mundur.
  const { nextKey, remaining } = useMemo(() => {
    if (!schedule) return { nextKey: null as string | null, remaining: null };
    let next: { key: string; label: string; diff: number } | null = null;
    for (const r of rows) {
      const ts = toSeconds(schedule[r.key]);
      if (ts === null) continue;
      if (ts > nowSec) {
        next = { key: r.key, label: r.label, diff: ts - nowSec };
        break;
      }
    }
    if (!next) {
      const first = rows.find((r) => toSeconds(schedule[r.key]) !== null);
      if (first) {
        const ts = toSeconds(schedule[first.key]) as number;
        next = {
          key: first.key,
          label: first.label,
          diff: 86400 - nowSec + ts,
        };
      }
    }
    return next
      ? { nextKey: next.key, remaining: { label: next.label, diff: next.diff } }
      : { nextKey: null, remaining: null };
  }, [schedule, nowSec, rows]);

  // Layar adzan: 5 menit sebelum waktu adzan sampai 1 menit sesudahnya.
  // Mode tes (tombol "Tes layar adzan") memakai hitung mundur singkat.
  const adzan = useMemo<AdzanState | null>(() => {
    if (demoStart !== null) {
      const elapsed = Math.floor((now.getTime() - demoStart) / 1000);
      if (elapsed >= 0 && elapsed < DEMO_TOTAL_SECONDS) {
        return {
          label: "Maghrib",
          delta: DEMO_COUNTDOWN_SECONDS - elapsed,
          total: DEMO_COUNTDOWN_SECONDS,
        };
      }
    }
    if (!schedule) return null;
    for (const r of rows) {
      if (!ADZAN_KEYS.includes(r.key)) continue;
      const ts = toSeconds(schedule[r.key]);
      if (ts === null) continue;
      const delta = ts - nowSec;
      if (delta <= ADZAN_LEAD_SECONDS && delta > -ADZAN_HOLD_SECONDS) {
        return { label: r.label, delta, total: ADZAN_LEAD_SECONDS };
      }
    }
    return null;
  }, [schedule, nowSec, rows, demoStart, now]);

  // Layar adzan tetap terpasang selama animasi outro GSAP berjalan.
  const lastAdzan = useRef<AdzanState | null>(null);
  if (adzan) lastAdzan.current = adzan;
  const [adzanMounted, setAdzanMounted] = useState(false);
  useEffect(() => {
    if (adzan) setAdzanMounted(true);
  }, [adzan]);

  // Zona waktu perangkat -> WIB / WITA / WIT.
  const offsetMin = -now.getTimezoneOffset();
  const zone =
    offsetMin === 420
      ? "WIB"
      : offsetMin === 480
        ? "WITA"
        : offsetMin === 540
          ? "WIT"
          : "";
  const clockText = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds(),
  )}`;

  const weekday = now.toLocaleDateString("id-ID", { weekday: "long" });
  const dateText = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hijri = useMemo(() => {
    try {
      const s = new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);
      return /H$/.test(s) ? s : `${s} H`;
    } catch {
      return "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);

  const [firstWord, ...restWords] = masjidName.trim().split(/\s+/);
  const countdown = remaining
    ? `${pad(Math.floor(remaining.diff / 3600))}:${pad(
        Math.floor((remaining.diff % 3600) / 60),
      )}:${pad(remaining.diff % 60)}`
    : "";

  const toggleFullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch {
      /* diabaikan */
    }
  };

  const tickerText = TICKER_MESSAGES.join("   •   ") + "   •   ";

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ fontFamily: FONT, background: t.root, color: t.text }}
    >
      <style>{`@keyframes masjid-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      <div className="relative h-full w-full overflow-hidden">
        {/* ====== Konten kanan (memenuhi layar; panel jadwal menutupi sisi kiri) ====== */}
        <div className="absolute inset-0 flex min-w-0 flex-col">
          {/* Header: nama masjid */}
          <div
            className="flex shrink-0 items-center justify-end"
            style={{
              height: "16%",
              paddingLeft: "40%",
              paddingRight: "2.6%",
              gap: "1.6vw",
              background: t.headerBg,
              borderBottom: `1px solid ${t.headerBorder}`,
            }}
          >
            <div className="min-w-0 text-right">
              <h1
                className="truncate font-bold"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "7.2vh",
                  lineHeight: 1.1,
                  color: t.nameRest,
                }}
              >
                <span style={{ color: t.nameFirst }}>{firstWord}</span>{" "}
                {restWords.join(" ")}
              </h1>
              <p
                className="truncate"
                style={{
                  fontSize: "2.1vh",
                  marginTop: "0.6vh",
                  color: t.subText,
                }}
              >
                {location.label}
              </p>
            </div>
            <div
              className="shrink-0"
              style={{ width: "10.5vh", height: "10.5vh" }}
            >
              <MosqueBadge t={t} />
            </div>
          </div>

          {/* Bar tanggal */}
          <div
            className="flex shrink-0 items-center justify-end"
            style={{
              height: "7%",
              paddingRight: "1.6%",
              gap: "0.8vw",
              fontSize: "3.6vh",
              background: t.dateBg,
              color: t.dateText,
            }}
          >
            <span aria-hidden="true">•</span>
            <span>
              <b>{weekday}</b> {dateText}
              {hijri && <> / {hijri}</>}
            </span>
          </div>

          {/* Gambar masjid */}
          <div
            className="relative min-h-0 flex-1 overflow-hidden"
            style={{ background: t.imageFallback }}
          >
            {bgImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bgImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setBgImage(null)}
              />
            )}

            <p
              className="absolute"
              style={{
                left: "40%",
                bottom: "1.2vh",
                fontSize: "1.7vh",
                color: t.copyText,
              }}
            >
              © {now.getFullYear()} Awas Imsak! — Commonly Works
            </p>

            {remaining && (
              <div
                className="absolute flex items-stretch overflow-hidden shadow-2xl"
                style={{
                  right: "1.6%",
                  bottom: "3.5vh",
                  height: "7vh",
                  borderRadius: "999px",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "9vh",
                    padding: "1.4vh",
                    background: t.pillIconBg,
                  }}
                >
                  <ClockBadgeIcon />
                </div>
                <div
                  className="flex items-center"
                  style={{
                    fontSize: "4.2vh",
                    padding: "0 2.6vh 0 1.6vh",
                    background: t.pillBg,
                    color: t.pillText,
                    border: `1px solid ${t.pillBorder}`,
                    borderLeft: 0,
                    borderRadius: "0 999px 999px 0",
                  }}
                >
                  <span>
                    {remaining.label}{" "}
                    <b className="tabular-nums" style={{ color: t.pillAccent }}>
                      -{countdown}
                    </b>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Teks berjalan */}
          <div
            className="shrink-0 overflow-hidden whitespace-nowrap"
            style={{
              height: "8.5%",
              fontSize: "4.4vh",
              background: t.tickerBg,
              color: t.tickerText,
              borderTop: `1px solid ${t.tickerBorder}`,
            }}
          >
            <div
              className="inline-flex h-full items-center"
              style={{ animation: "masjid-ticker 50s linear infinite" }}
            >
              {[0, 1].map((dup) => (
                <span key={dup} className="inline-block">
                  {tickerText}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ====== Panel jadwal (tepi kanan melengkung) ====== */}
        <div
          className="absolute left-0 top-0 z-10 flex h-full flex-col"
          style={{
            width: "38%",
            clipPath: "ellipse(96% 130% at 0% 50%)",
            backgroundColor: t.panelBgColor,
            backgroundImage: t.panelBgImage,
            backgroundSize: "0.7vh 0.7vh, 100% 100%",
          }}
        >
          {rows.map(({ key, label }) => {
            const active = key === nextKey;
            const color = active ? t.activeText : t.text;
            return (
              <div
                key={key}
                className="flex flex-1 items-center"
                style={{
                  paddingLeft: "3.4vw",
                  borderBottom: `1px solid ${t.rowBorder}`,
                  background: active ? t.rowActiveBg : "transparent",
                }}
              >
                <div
                  className="shrink-0"
                  style={{
                    width: "7.4vh",
                    height: "7.4vh",
                    marginRight: "1.9vw",
                    color,
                  }}
                >
                  <PrayerIcon name={key} />
                </div>
                <div className="flex flex-col" style={{ color }}>
                  <span style={{ fontSize: "3.9vh", lineHeight: 1.1 }}>
                    {label}
                  </span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: "7.2vh",
                      lineHeight: 1.02,
                      fontWeight: 800,
                    }}
                  >
                    {schedule?.[key] ?? "--:--"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====== Jam analog di perbatasan panel ====== */}
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: "36.3%",
            top: "50.6%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <AnalogClock light={theme === "light"} />
        </div>

        {/* ====== Layar adzan: hitung mundur 5 menit ====== */}
        {adzanMounted && lastAdzan.current && (
          <AdzanScreen
            t={t}
            open={!!adzan}
            label={lastAdzan.current.label}
            delta={lastAdzan.current.delta}
            total={lastAdzan.current.total}
            year={now.getFullYear()}
            clock={clockText}
            zone={zone}
            onClosed={() => setAdzanMounted(false)}
          />
        )}
      </div>

      {/* Kontrol: muncul saat kursor diarahkan ke pojok kiri bawah */}
      <div className="absolute bottom-0 left-0 z-[60] flex gap-2 p-3 opacity-0 transition-opacity focus-within:opacity-100 hover:opacity-100">
        <button
          onClick={onExit}
          className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-xs text-white hover:border-[#aad576]/60"
        >
          ⬅ Keluar
        </button>
        <button
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-xs text-white hover:border-[#aad576]/60"
        >
          {theme === "dark" ? "Mode terang" : "Mode gelap"}
        </button>
        <button
          onClick={toggleFullscreen}
          className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-xs text-white hover:border-[#aad576]/60"
        >
          Layar penuh
        </button>
        {ENABLE_DEMO_HOTKEY && (
          <button
            onClick={() => setDemoStart(Date.now())}
            className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-xs text-white hover:border-[#aad576]/60"
          >
            Tes layar adzan (H)
          </button>
        )}
      </div>
    </div>
  );
}

/* Isi timer (ikon + waktu). Dipakai dua kali: lapisan dasar & lapisan di atas progress. */
function TimerLabel({ time, color }: { time: string; color: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center gap-[1.6vh]"
      style={{ color }}
    >
      <span style={{ width: "6.6vh", height: "6.6vh" }}>
        <AlarmIcon />
      </span>
      <span
        className="tabular-nums font-extrabold"
        style={{ fontSize: "7.4vh", lineHeight: 1 }}
      >
        {time}
      </span>
    </div>
  );
}

function AdzanScreen({
  t,
  open,
  label,
  delta,
  total,
  year,
  clock,
  zone,
  onClosed,
}: {
  t: ThemeTokens;
  open: boolean;
  label: string;
  delta: number;
  total: number;
  year: number;
  clock: string;
  zone: string;
  onClosed: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;
  const firstRun = useRef(true);

  // Dua fase: (1) hitung mundur menuju adzan, (2) jeda ADZAN_HOLD_SECONDS
  // ("Telah Masuk Waktu") untuk muadzin mengumandangkan adzan. Timer & progress
  // bar mengikuti fase yang sedang berjalan.
  const started = delta <= 0;
  const secs = started
    ? Math.min(ADZAN_HOLD_SECONDS, Math.max(0, ADZAN_HOLD_SECONDS + delta))
    : delta;
  const span = started ? ADZAN_HOLD_SECONDS : total;
  const pct = Math.min(100, Math.max(0, (secs / span) * 100));
  const time = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

  // Posisi awal sebelum frame pertama digambar: tirai terbuka di luar layar,
  // isi layar adzan tersembunyi.
  useLayoutEffect(() => {
    if (!root.current) return;
    const q = gsap.utils.selector(root.current);
    gsap.set(q(".az-curtain-l"), { xPercent: -101 });
    gsap.set(q(".az-curtain-r"), { xPercent: 101 });
    gsap.set(q(".az-stage"), { autoAlpha: 0 });
    gsap.set(q(".az-item"), { autoAlpha: 0, y: 28 });
    gsap.set(q(".az-frame"), { autoAlpha: 0, scale: 1.04 });
  }, []);

  // Intro saat `open` true, outro saat `open` false (lalu lepas dari DOM).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    tl.current?.kill();

    if (open) {
      firstRun.current = false;
      const tlIn = gsap.timeline();
      tlIn
        // 1) tirai menutup layar TV
        .set(q(".az-curtain-l, .az-curtain-r"), { autoAlpha: 1 })
        .to(q(".az-curtain-l"), {
          xPercent: 0,
          duration: 0.9,
          ease: "power3.inOut",
        })
        .to(
          q(".az-curtain-r"),
          { xPercent: 0, duration: 0.9, ease: "power3.inOut" },
          "<",
        )
        // 2) saat tertutup, ganti ke layar adzan
        .set(q(".az-stage"), { autoAlpha: 1 })
        // 3) tirai membuka
        .to(q(".az-curtain-l"), {
          xPercent: -101,
          duration: 1.1,
          ease: "power3.inOut",
        })
        .to(
          q(".az-curtain-r"),
          { xPercent: 101, duration: 1.1, ease: "power3.inOut" },
          "<",
        )
        // 4) isi muncul berurutan
        .to(
          q(".az-frame"),
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.7",
        )
        .to(
          q(".az-item"),
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.7",
        );
      tl.current = tlIn;
    } else if (!firstRun.current) {
      const tlOut = gsap.timeline({
        onComplete: () => onClosedRef.current(),
      });
      tlOut
        // isi naik & memudar
        .to(q(".az-item"), {
          autoAlpha: 0,
          y: -24,
          duration: 0.5,
          ease: "power2.in",
          stagger: { each: 0.06, from: "end" },
        })
        .to(q(".az-frame"), { autoAlpha: 0, duration: 0.4 }, "<")
        // tirai menutup
        .to(
          q(".az-curtain-l"),
          { xPercent: 0, duration: 0.9, ease: "power3.inOut" },
          "-=0.1",
        )
        .to(
          q(".az-curtain-r"),
          { xPercent: 0, duration: 0.9, ease: "power3.inOut" },
          "<",
        )
        // layar adzan dilepas, TV tampak kembali
        .set(q(".az-stage"), { autoAlpha: 0 })
        .to(q(".az-curtain-l"), {
          xPercent: -101,
          duration: 1.1,
          ease: "power3.inOut",
        })
        .to(
          q(".az-curtain-r"),
          { xPercent: 101, duration: 1.1, ease: "power3.inOut" },
          "<",
        );
      tl.current = tlOut;
    }

    return () => {
      // tidak di-kill di sini agar outro tetap selesai walau re-render;
      // kill dilakukan di awal efek berikutnya / saat unmount.
    };
  }, [open]);

  // PERBAIKAN build Vercel: cleanup HARUS bertipe void. Sebelumnya
  // `() => () => tl.current?.kill()` mengembalikan Timeline sehingga
  // TypeScript menolaknya ("not assignable to type 'void | Destructor'").
  useEffect(() => {
    return () => {
      tl.current?.kill();
    };
  }, []);

  const curtainBg = `repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0, rgba(0,0,0,0.14) 1.4vw, rgba(255,255,255,0.07) 1.4vw, rgba(255,255,255,0.07) 2.8vw), ${t.pillIconBg}`;

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
    >
      {/* ===== Isi layar adzan ===== */}
      <div
        className="az-stage absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ background: t.adzanBg }}
      >
        {/* bingkai tipis ganda */}
        <div
          className="az-frame pointer-events-none absolute"
          style={{ inset: "3vh", border: `0.5vh solid ${t.adzanFrame}` }}
        />
        <div
          className="az-frame pointer-events-none absolute"
          style={{ inset: "4.6vh", border: `0.2vh solid ${t.adzanFrame}` }}
        />

        {/* Jam + zona waktu di atas tulisan "Menuju Adzan" */}
        <div
          className="az-item flex items-baseline justify-center"
          style={{ gap: "1.6vh", color: t.adzanTitle, marginBottom: "1vh" }}
        >
          <span
            className="tabular-nums font-bold"
            style={{ fontSize: "9vh", lineHeight: 1, letterSpacing: "0.02em" }}
          >
            {clock}
          </span>
          {zone && (
            <span
              className="font-semibold"
              style={{ fontSize: "4vh", color: t.pillAccent, lineHeight: 1 }}
            >
              {zone}
            </span>
          )}
        </div>

        <p
          className="az-item"
          style={{
            fontSize: "6.2vh",
            color: t.adzanTitle,
            letterSpacing: "0.02em",
          }}
        >
          {started ? "Telah Masuk Waktu" : "Menuju Adzan"}
        </p>

        <h2
          className="az-item font-extrabold uppercase"
          style={{
            fontSize: "min(24vh, 15vw)",
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            backgroundImage: t.adzanGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          {label}
        </h2>

        {/* Progress bar: timer SELALU di tengah, tidak ikut lebar progress */}
        <div
          className="az-item relative overflow-hidden"
          style={{
            marginTop: "3vh",
            width: "62vw",
            height: "11vh",
            borderRadius: "999px",
            background: t.adzanTrack,
          }}
        >
          {/* isi progress */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pct}%`,
              borderRadius: "999px",
              background: t.adzanFill,
              transition: "width 1s linear",
            }}
          />
          {/* timer di atas track (warna tema) */}
          <div className="absolute inset-0">
            <TimerLabel time={time} color={t.adzanTitle} />
          </div>
          {/* salinan timer putih, hanya terlihat di atas area progress */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - pct}% 0 0)`,
              transition: "clip-path 1s linear",
            }}
          >
            <TimerLabel time={time} color={t.adzanFillText} />
          </div>
        </div>

        <p
          className="az-item absolute"
          style={{
            bottom: "6.6vh",
            fontSize: "1.9vh",
            letterSpacing: "0.08em",
            color: t.adzanFooter,
          }}
        >
          © {year} Awas Imsak! — Commonly Works
        </p>
      </div>

      {/* ===== Tirai (GSAP) ===== */}
      <div
        className="az-curtain-l absolute left-0 top-0 h-full"
        style={{
          width: "50.5%",
          background: curtainBg,
          borderRight: `0.6vh solid ${t.badgeMoon}`,
          boxShadow: "0 0 4vh rgba(0,0,0,0.45)",
        }}
      />
      <div
        className="az-curtain-r absolute right-0 top-0 h-full"
        style={{
          width: "50.5%",
          background: curtainBg,
          borderLeft: `0.6vh solid ${t.badgeMoon}`,
          boxShadow: "0 0 4vh rgba(0,0,0,0.45)",
        }}
      />
    </div>
  );
}
