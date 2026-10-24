"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import Select, { StylesConfig } from "react-select";
import Textra from "react-textra";
import Image from "next/image";
import { Onest } from "next/font/google";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Notification from "../notification/page";
import Weather from "../weather/page";
import RamadhanCountdown from "../ramadhanCountdown/page";

const onest = Onest({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

interface Location {
  value: string;
  label: string;
}
interface Config {
  opencageApiKey: string;
}
export const config: Config = {
  opencageApiKey: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || "",
};

const quickLinks = [
  { href: "/niat", label: "Awas Lupa Niat", delay: 1.5 },
  { href: "/tadarus", label: "Awas Lupa Tadarus", delay: 2 },
];

const mainTimes = [
  { key: "imsak", label: "Imsak", delay: 1400 },
  { key: "maghrib", label: "Maghrib", delay: 2000 },
];

const otherTimes = [
  { key: "subuh", label: "Subuh", delay: 1500 },
  { key: "terbit", label: "Terbit", delay: 1600 },
  { key: "dhuha", label: "Dhuha", delay: 1700 },
  { key: "dzuhur", label: "Dzuhur", delay: 1800 },
  { key: "ashar", label: "Ashar", delay: 1900 },
  { key: "isya", label: "Isya", delay: 2100 },
];

const selectStyles: StylesConfig<Location, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    borderColor: state.isFocused
      ? "rgba(170,213,118,0.6)"
      : "rgba(255,255,255,0.12)",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(170,213,118,0.15)" : "none",
    opacity: state.isDisabled ? 0.6 : 1,
    cursor: "text",
    ":hover": { borderColor: "rgba(170,213,118,0.4)" },
  }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  input: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.55)" }),
  indicatorSeparator: (base) => ({
    ...base,
    background: "rgba(255,255,255,0.12)",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "rgba(255,255,255,0.5)",
    ":hover": { color: "#fff" },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "rgba(255,255,255,0.5)",
    ":hover": { color: "#fff" },
  }),
  menu: (base) => ({
    ...base,
    background: "#0d1811",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  }),
  option: (base, state) => ({
    ...base,
    color: "#fff",
    cursor: "pointer",
    background: state.isSelected
      ? "#3a5a25"
      : state.isFocused
        ? "rgba(170,213,118,0.12)"
        : "transparent",
    ":active": { background: "rgba(170,213,118,0.2)" },
  }),
  noOptionsMessage: (base) => ({ ...base, color: "rgba(255,255,255,0.6)" }),
};

const Hero = () => {
  useEffect(() => {
    AOS.init({ offset: 0 });
    AOS.refresh();
  }, []);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [prayerSchedule, setPrayerSchedule] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimeZone, setLocalTimeZone] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.myquran.com/v2/sholat/kota/semua",
      );
      const data = await response.json();
      const formattedLocations = data.data.map(
        (location: { id: string; lokasi: string }) => ({
          value: location.id,
          label: location.lokasi,
        }),
      );
      setLocations(formattedLocations);
      return formattedLocations;
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data lokasi", { id: "lokasi-gagal" });
      return [];
    }
  };

  const fetchPrayerSchedule = async (idKota: string) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    try {
      const url = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${year}/${month}/${day}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.data && data.data.jadwal) {
        setPrayerSchedule(data.data.jadwal);
      } else {
        console.error("Invalid response data:", data);
      }
    } catch (error) {
      console.error("Error fetching prayer schedule:", error);
    }
  };

  const detectAndSetLocation = async (locations: Location[]) => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            const options = {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            };

            navigator.geolocation.getCurrentPosition(
              resolve,
              (error: GeolocationPositionError) => {
                let errorMessage = "Gagal mendeteksi lokasi: ";
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    errorMessage +=
                      "Izin lokasi ditolak. Mohon aktifkan izin lokasi di pengaturan browser Anda.";
                    break;
                  case error.POSITION_UNAVAILABLE:
                    errorMessage +=
                      "Informasi lokasi tidak tersedia. Pastikan GPS/lokasi perangkat Anda aktif.";
                    break;
                  case error.TIMEOUT:
                    errorMessage +=
                      "Waktu permintaan lokasi habis. Silakan coba lagi.";
                    break;
                  default:
                    errorMessage +=
                      error.message ||
                      "Terjadi kesalahan yang tidak diketahui.";
                }
                reject(new Error(errorMessage));
              },
              options,
            );
          },
        );

        const normalizeString = (str: string): string => {
          return str
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .replace(/\s+/g, " ")
            .replace(/kabupaten/g, "kab")
            .replace(/kota/g, "kota")
            .trim();
        };

        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&language=id`,
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (!data.results || data.results.length === 0) {
            throw new Error("Tidak ada hasil lokasi yang ditemukan");
          }

          const locationDetail = data.results[0].components;
          const regency = locationDetail.regency;
          const city = locationDetail.city;
          const county = locationDetail.county;
          const state = locationDetail.state;

          const findLocation = (
            searchTerms: string[],
          ): Location | undefined => {
            return locations.find((loc) => {
              const normalizedLocationLabel = normalizeString(loc.label);
              return searchTerms.some((term) => {
                const normalizedTerm = normalizeString(term);
                return (
                  normalizedLocationLabel.includes(normalizedTerm) ||
                  normalizedTerm.includes(normalizedLocationLabel)
                );
              });
            });
          };

          let matchedLocation: Location | undefined;
          let detectedLocation = "";

          if (regency) {
            matchedLocation = findLocation([regency]);
            detectedLocation = regency;
          }

          if (!matchedLocation && city) {
            matchedLocation = findLocation([city]);
            detectedLocation = city;
          }

          if (!matchedLocation && county) {
            matchedLocation = findLocation([county]);
            detectedLocation = county;
          }

          if (!matchedLocation && state) {
            matchedLocation = findLocation([state]);
            detectedLocation = state;
          }

          if (matchedLocation) {
            setSelectedLocation(matchedLocation);
            toast.success(
              `Lokasi terdeteksi: ${matchedLocation.label} (${detectedLocation})`,
              {
                id: "lokasi-terdeteksi",
                duration: 4000,
              },
            );
          } else {
            toast.error(
              "Lokasi terdeteksi tetapi tidak ada dalam daftar yang tersedia",
              { id: "lokasi-tidak-ada", duration: 4000 },
            );
            setSelectedLocation(locations[50]); // Default location
          }

          console.log("Detail Lokasi:", {
            regency,
            city,
            county,
            state,
            detected: detectedLocation,
            matched: matchedLocation?.label,
          });
        } catch (apiError) {
          console.error("API Error:", apiError);
          toast.error("Gagal mengambil detail lokasi dari server", {
            id: "lokasi-server",
            duration: 4000,
          });
          setSelectedLocation(locations[50]);
        }
      } catch (error) {
        console.error("Geolocation Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Gagal mendeteksi lokasi",
          { id: "lokasi-geolocation", duration: 4000 },
        );
        setSelectedLocation(locations[50]);
      }
    } else {
      toast.error("Browser tidak mendukung geolocation", {
        id: "lokasi-browser",
        duration: 4000,
      });
      setSelectedLocation(locations[50]);
    }
    setIsLoading(false);
  };

  const handleLocationChange = (selected: Location | null) => {
    setSelectedLocation(selected);
    if (selected) {
      fetchPrayerSchedule(selected.value);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const locationsList = await fetchData();
      await detectAndSetLocation(locationsList);
    };

    initializeLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchPrayerSchedule(selectedLocation.value);
    }
  }, [selectedLocation]);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const offsetMinutes = -currentTime.getTimezoneOffset();
    const offsetHours = Math.floor(offsetMinutes / 60);

    let timeZone = "";
    if (offsetHours === 7) {
      timeZone = "WIB";
    } else if (offsetHours === 8) {
      timeZone = "WITA";
    } else if (offsetHours === 9) {
      timeZone = "WIT";
    }

    const formattedTime = `${formatTime(currentTime.getHours())}:${formatTime(
      currentTime.getMinutes(),
    )}:${formatTime(currentTime.getSeconds())}`;

    const timeZoneInfo = `UTC+${offsetHours} | ${formattedTime} ${timeZone}`;

    setLocalTimeZone(timeZoneInfo);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  return (
    <div className="bodi-hero">
      {/*<RamadhanCountdown />*/}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col justify-center gap-4 px-4 py-4 sm:gap-8 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-4">
        <Toaster position="top-left" reverseOrder={false} />

        <div className="flex flex-col lg:w-[52%]">
          {/* Ikon + judul: vertikal & center di mobile, berdampingan di desktop */}
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-5">
            <Image
              src="/img/icon-app.png"
              width={512}
              height={512}
              priority
              alt="Ikon Awas Imsak"
              className="h-20 w-20 shrink-0 object-contain sm:h-28 sm:w-28 lg:h-[clamp(8rem,28vh,14rem)] lg:w-[clamp(8rem,28vh,14rem)]"
              data-aos="fade-up"
              data-aos-delay="800"
              data-aos-duration="1000"
            />

            <h1
              className={`${onest.className} text-center text-[length:min(13vw,3.25rem)] leading-[0.9] tracking-tight text-white drop-shadow-xl sm:text-[length:min(11vw,4.5rem)] lg:text-left lg:text-[length:clamp(3.5rem,min(7.5vw,15vh),7.5rem)]`}
              data-aos="fade-up"
              data-aos-delay="1000"
              data-aos-duration="1000"
            >
              Awas <br className="hidden lg:block" />
              Imsak!
            </h1>
          </div>

          <div
            className="mt-3 min-h-[2.5rem] text-center sm:mt-4 sm:min-h-[1.75rem] lg:text-left"
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-duration="1000"
          >
            <Textra
              effect="downTop"
              duration={500}
              data={[
                "Awas Imsak! hadir untuk teman-teman yang suka sahur jam 12 siang",
                "Masa puasa 30 hari doang ga bisa sih bang?",
                "Awas Imsak! Puasa Tenang, Hati Gembirang.",
              ]}
              className="opensans text-sm font-semibold text-[#cfe3bd] sm:text-[15px]"
            />
          </div>

          <div
            className="poppins-medium mt-3 max-w-[34rem] border-l-2 border-[#c9a45c]/40 pl-4 text-[12px] leading-relaxed text-white/80 sm:mt-6 sm:text-sm"
            data-aos="fade-up"
            data-aos-delay="1400"
            data-aos-duration="1000"
          >
            <p className="text-white/60">Rasulullah saw bersabda:</p>
            <p
              dir="rtl"
              lang="ar"
              className="my-2 text-base leading-[1.8] text-[#e3c783] sm:text-[1.35rem] sm:leading-[1.9]"
            >
              ثَلَاثُ دَعَوَاتٍ مُسْتَجَابَاتٍ ؛دَعْوَةُ الصَّائِمِ وَدَعْوَةُ
              الْمُسَافِرِ وَدَعْوَةُ الْمَظْلُوْمِ
            </p>
            <p>
              Artinya: Ada tiga macam doa yang mustajab, yaitu doa orang yang
              sedang puasa, doa musafir, dan doa orang yang teraniaya (HR
              Baihaqi).
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap">
            {quickLinks.map(({ href, label, delay }) => (
              <Link key={href} href={href} className="block">
                <motion.button
                  className="active-box active-shadow h-10 w-full rounded-full border border-white/15 bg-black/60 px-2 text-[11px] leading-tight text-white transition-colors hover:border-[#aad576]/60 hover:bg-[#aad576]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#aad576] sm:h-10 sm:w-auto sm:whitespace-nowrap sm:px-5 sm:text-sm"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay, duration: 1 }}
                >
                  {label}
                </motion.button>
              </Link>
            ))}
          </div>

          <motion.div
            className="mt-3 text-center sm:mt-4 lg:text-left"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <Link
              href="/masjid"
              className="text-[12px] text-[#cfe3bd] underline decoration-[#aad576]/50 underline-offset-4 transition-colors hover:text-white hover:decoration-[#aad576] sm:text-sm"
            >
              Ingin menampilkan khusus untuk masjid / mushola Anda?
            </Link>
          </motion.div>

          <motion.div
            className="mt-3 sm:mt-4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 2.5,
              duration: 1.5,
              type: "spring",
            }}
          >
            <p className="text-[11px] italic text-white/60">
              © {new Date().getFullYear()}{" "}
              <Link
                href="https://commonly.riotrevenger.xyz"
                rel="noopener noreferrer"
                target="_blank"
                className="hover:text-white hover:underline"
              >
                Commonly Works
              </Link>{" "}
              under the MIT license.
            </p>
          </motion.div>
        </div>

        <div
          className="flex w-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-6 lg:w-[44%] lg:max-w-[40rem]"
          data-aos="fade-up"
          data-aos-delay="800"
          data-aos-duration="1000"
        >
          <div
            className="mb-3 flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-2 sm:mb-4 sm:py-2.5"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#aad576] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#aad576]" />
            </span>
            <p className="opensans text-base font-semibold tabular-nums sm:text-lg">
              {localTimeZone}
            </p>
          </div>

          <label
            htmlFor="wilayah"
            className="poppins-extrabold mb-1.5 text-base sm:mb-2"
            data-aos="fade-up"
            data-aos-delay="1100"
            data-aos-duration="1000"
          >
            Pilih Wilayah:
          </label>
          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-duration="1000"
            className="relative z-[999] mb-3 sm:mb-4"
          >
            <Select
              inputId="wilayah"
              options={locations}
              value={selectedLocation}
              onChange={handleLocationChange}
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

          {prayerSchedule && (
            <div className="poppins-regular">
              <div className="mb-3 flex justify-between gap-4 sm:mb-4">
                <div
                  className="flex min-w-0 flex-col"
                  data-aos="fade-up"
                  data-aos-delay="1300"
                  data-aos-duration="1000"
                >
                  <span className="text-xs text-white/60">Wilayah:</span>
                  <span className="text-base font-semibold sm:text-lg">
                    {selectedLocation && selectedLocation.label}
                  </span>
                </div>
                <div
                  className="flex flex-col text-right"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                  data-aos-duration="1000"
                >
                  <span className="text-xs text-white/60">Hari / Tanggal:</span>
                  <span className="text-base font-semibold sm:text-lg">
                    {prayerSchedule.tanggal}
                  </span>
                </div>
              </div>

              {/* Imsak dan Maghrib dipisah karena menandai awal dan akhir puasa. */}
              <div className="mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3">
                {mainTimes.map(({ key, label, delay }) => (
                  <div
                    key={key}
                    className="active-box active-shadow flex flex-col rounded-2xl border border-white/10 bg-black/60 px-4 py-2.5 sm:py-4"
                    data-aos="fade-up"
                    data-aos-delay={delay}
                    data-aos-duration="1000"
                  >
                    <span className="text-sm font-semibold text-white sm:text-base">
                      {label}:
                    </span>
                    <span className="text-3xl font-extrabold tabular-nums sm:text-4xl">
                      {prayerSchedule[key]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3 lg:gap-2">
                {otherTimes.map(({ key, label, delay }) => (
                  <div
                    key={key}
                    className="active-shadow flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:py-3"
                    data-aos="fade-up"
                    data-aos-delay={delay}
                    data-aos-duration="1000"
                  >
                    <span className="text-xs text-white/60">{label}:</span>
                    <span className="text-base font-semibold tabular-nums sm:text-lg">
                      {prayerSchedule[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
