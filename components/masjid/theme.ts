export type TvTheme = "dark" | "light";

export interface ThemeTokens {
  root: string;
  headerBg: string;
  headerBorder: string;
  nameFirst: string;
  nameRest: string;
  subText: string;
  dateBg: string;
  dateText: string;
  panelBgColor: string;
  panelBgImage: string;
  rowBorder: string;
  rowActiveBg: string;
  text: string;
  activeText: string;
  imageFallback: string;
  copyText: string;
  pillIconBg: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  pillAccent: string;
  tickerBg: string;
  tickerText: string;
  tickerBorder: string;
  badgeFill: string;
  badgeStroke: string;
  badgeBuilding: string;
  badgeDoor: string;
  badgeMoon: string;
  // layar adzan
  adzanBg: string;
  adzanFrame: string;
  adzanTitle: string;
  adzanGradient: string;
  adzanTrack: string;
  adzanFill: string;
  adzanFillText: string;
  adzanFooter: string;
}

// Gelap = hijau seperti di hero. Terang = hijau diganti putih, teks jadi hijau.
export const THEMES: Record<TvTheme, ThemeTokens> = {
  dark: {
    root: "#0d1811",
    headerBg: "linear-gradient(90deg,#0d1811 0%,#1e3828 100%)",
    headerBorder: "#3e664e",
    nameFirst: "#e3c783",
    nameRest: "#ffffff",
    subText: "#ffffff",
    dateBg: "linear-gradient(90deg,#0d1811 0%,#2b4733 45%,#4f772d 100%)",
    dateText: "#ffffff",
    panelBgColor: "#12241a",
    panelBgImage:
      "radial-gradient(rgba(170,213,118,0.07) 1px, transparent 1.3px), linear-gradient(180deg,#1e3828 0%,#152a1d 55%,#0d1811 100%)",
    rowBorder: "rgba(62,102,78,0.7)",
    rowActiveBg: "rgba(170,213,118,0.12)",
    text: "#ffffff",
    activeText: "#aad576",
    imageFallback:
      "radial-gradient(ellipse at 70% 30%,#4f772d 0%,#1e3828 45%,#0d1811 100%)",
    copyText: "rgba(255,255,255,0.7)",
    pillIconBg: "linear-gradient(180deg,#4f772d,#3a5a25)",
    pillBg: "rgba(13,24,17,0.95)",
    pillBorder: "#3e664e",
    pillText: "#ffffff",
    pillAccent: "#aad576",
    tickerBg: "#0d1811",
    tickerText: "#cfe3bd",
    tickerBorder: "#3e664e",
    badgeFill: "#0d1811",
    badgeStroke: "#3e664e",
    badgeBuilding: "#aad576",
    badgeDoor: "#0d1811",
    badgeMoon: "#e3c783",
    adzanBg: "#0d1811",
    adzanFrame: "#3e664e",
    adzanTitle: "#ffffff",
    adzanGradient: "linear-gradient(180deg,#e9f5d6 0%,#aad576 55%,#4f772d 100%)",
    adzanTrack: "rgba(170,213,118,0.22)",
    adzanFill: "linear-gradient(90deg,#3a5a25,#4f772d 60%,#aad576)",
    adzanFillText: "#ffffff",
    adzanFooter: "rgba(255,255,255,0.55)",
  },
  light: {
    root: "#ffffff",
    headerBg: "linear-gradient(90deg,#ffffff 0%,#eef5e6 100%)",
    headerBorder: "#cfe3bd",
    nameFirst: "#4f772d",
    nameRest: "#1e3828",
    subText: "#4f772d",
    dateBg: "linear-gradient(90deg,#ffffff 0%,#eef5e6 50%,#d9ebc6 100%)",
    dateText: "#2b4733",
    panelBgColor: "#ffffff",
    panelBgImage:
      "radial-gradient(rgba(79,119,45,0.08) 1px, transparent 1.3px), linear-gradient(180deg,#ffffff 0%,#f6faf1 60%,#eef5e6 100%)",
    rowBorder: "rgba(79,119,45,0.22)",
    rowActiveBg: "rgba(79,119,45,0.12)",
    text: "#2b4733",
    activeText: "#4f772d",
    imageFallback:
      "radial-gradient(ellipse at 70% 30%,#ffffff 0%,#e4f0d6 50%,#cfe3bd 100%)",
    copyText: "rgba(30,56,40,0.7)",
    pillIconBg: "linear-gradient(180deg,#5f8f35,#4f772d)",
    pillBg: "rgba(255,255,255,0.96)",
    pillBorder: "#aad576",
    pillText: "#2b4733",
    pillAccent: "#4f772d",
    tickerBg: "#ffffff",
    tickerText: "#3a5a25",
    tickerBorder: "#cfe3bd",
    badgeFill: "#ffffff",
    badgeStroke: "#aad576",
    badgeBuilding: "#4f772d",
    badgeDoor: "#ffffff",
    badgeMoon: "#c9a45c",
    adzanBg: "#ffffff",
    adzanFrame: "#aad576",
    adzanTitle: "#2b4733",
    adzanGradient: "linear-gradient(180deg,#7fb04a 0%,#4f772d 55%,#2f5a1f 100%)",
    adzanTrack: "rgba(79,119,45,0.16)",
    adzanFill: "linear-gradient(90deg,#4f772d,#6a9a3a 60%,#8fc25a)",
    adzanFillText: "#ffffff",
    adzanFooter: "rgba(30,56,40,0.55)",
  },
};
