"use client";

import { useEffect, useMemo, useState } from "react";
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
        stroke="#fff"
        strokeWidth="3"
      />
      <path
        d="M24 17v10l6 4M7 12l7-6M41 12l-7-6M10 41l4-4M38 41l-4-4"
        fill="none"
        stroke="#fff"
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

  // Gambar masjid dipilih acak sekali saat TV dibuka.
  useEffect(() => {
    setBgImage(pickRandomMosqueImage());
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
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
  const adzan = useMemo(() => {
    if (!schedule) return null;
    for (const r of rows) {
      if (!ADZAN_KEYS.includes(r.key)) continue;
      const ts = toSeconds(schedule[r.key]);
      if (ts === null) continue;
      const delta = ts - nowSec;
      if (delta <= ADZAN_LEAD_SECONDS && delta > -ADZAN_HOLD_SECONDS) {
        return { label: r.label, delta };
      }
    }
    return null;
  }, [schedule, nowSec, rows]);

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
                style={{ fontSize: "2.1vh", marginTop: "0.6vh", color: t.subText }}
              >
                {location.label}
              </p>
            </div>
            <div className="shrink-0" style={{ width: "10.5vh", height: "10.5vh" }}>
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
        {adzan && (
          <AdzanScreen
            t={t}
            label={adzan.label}
            delta={adzan.delta}
            year={now.getFullYear()}
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
      </div>
    </div>
  );
}

function AdzanScreen({
  t,
  label,
  delta,
  year,
}: {
  t: ThemeTokens;
  label: string;
  delta: number;
  year: number;
}) {
  const started = delta <= 0;
  const secs = Math.max(delta, 0);
  const pct = Math.min(100, Math.max(0, (secs / ADZAN_LEAD_SECONDS) * 100));
  const time = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center"
      style={{ background: t.adzanBg }}
    >
      {/* bingkai tipis ganda */}
      <div
        className="pointer-events-none absolute"
        style={{
          inset: "3vh",
          border: `0.5vh solid ${t.adzanFrame}`,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          inset: "4.6vh",
          border: `0.2vh solid ${t.adzanFrame}`,
        }}
      />

      <p style={{ fontSize: "6.2vh", color: t.adzanTitle, letterSpacing: "0.02em" }}>
        {started ? "Telah Masuk Waktu" : "Menuju Adzan"}
      </p>

      <h2
        className="font-extrabold uppercase"
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

      <div
        className="relative overflow-hidden"
        style={{
          marginTop: "3vh",
          width: "62vw",
          height: "11vh",
          borderRadius: "999px",
          background: t.adzanTrack,
        }}
      >
        <div
          className="flex h-full items-center justify-center gap-[1.6vh]"
          style={{
            width: `${Math.max(pct, 24)}%`,
            borderRadius: "999px",
            background: t.adzanFill,
            color: t.adzanFillText,
            transition: "width 1s linear",
          }}
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
      </div>

      <p
        className="absolute"
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
  );
}
