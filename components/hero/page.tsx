"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import Textra from "react-textra";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Notification from "../notification/page";
import Weather from "../weather/page";
import RamadhanCountdown from "../ramadhanCountdown/page";

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

const Hero = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [prayerSchedule, setPrayerSchedule] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimeZone, setLocalTimeZone] = useState("");

  // Fungsi untuk mengambil data lokasi dari API
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.myquran.com/v2/sholat/kota/semua"
      );
      const data = await response.json();
      const formattedLocations = data.data.map(
        (location: { id: string; lokasi: string }) => ({
          value: location.id,
          label: location.lokasi,
        })
      );
      setLocations(formattedLocations);
      return formattedLocations;
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data lokasi");
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
              options
            );
          }
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
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&language=id`
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
          const county = locationDetail.county; // Tambahan untuk kabupaten
          const state = locationDetail.state; // Tambahan untuk provinsi

          // Fungsi untuk mencari lokasi berdasarkan beberapa kriteria
          const findLocation = (
            searchTerms: string[]
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

          // Urutan pencarian berdasarkan prioritas
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

          // Fallback ke provinsi jika tidak ada yang cocok
          if (!matchedLocation && state) {
            matchedLocation = findLocation([state]);
            detectedLocation = state;
          }

          if (matchedLocation) {
            setSelectedLocation(matchedLocation);
            toast.success(
              `Lokasi terdeteksi: ${matchedLocation.label} (${detectedLocation})`,
              {
                duration: 4000,
              }
            );
          } else {
            toast.error(
              "Lokasi terdeteksi tetapi tidak ada dalam daftar yang tersedia",
              { duration: 4000 }
            );
            setSelectedLocation(locations[50]); // Default location
          }

          // Log untuk debugging
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
            duration: 4000,
          });
          setSelectedLocation(locations[50]);
        }
      } catch (error) {
        console.error("Geolocation Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Gagal mendeteksi lokasi",
          { duration: 4000 }
        );
        setSelectedLocation(locations[50]);
      }
    } else {
      toast.error("Browser tidak mendukung geolocation", { duration: 4000 });
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
      currentTime.getMinutes()
    )}:${formatTime(currentTime.getSeconds())}`;

    const timeZoneInfo = `UTC+${offsetHours} | ${formattedTime} ${timeZone}`;

    setLocalTimeZone(timeZoneInfo);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  return (
    <div className="bodi-hero">
      <RamadhanCountdown />
      <div className="px-[3.5rem] py-[1rem] flex max-[640px]:flex-col max-[640px]:py-[2rem] max-[640px]:space-y-10 justify-between items-center h-screen">
        <Toaster position="top-left" reverseOrder={false} />
        <div className="flex flex-col">
          <Image
            src="/img/bunderan.png"
            sizes="100vw"
            style={{
              width: "30%",
              height: "auto",
            }}
            width={250}
            height={250}
            alt="lantern"
            className="rounded-3xl max-[640px]:mb-5"
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-duration="1000"
          />

          <p
            className="
          bg-gradient-to-r 
          from-[#4f772d] 
          to-[#aad576] 
          inline-block 
          kahlil
          text-[8rem]
          max-[640px]:text-[5.5rem]
          text-transparent 
          bg-clip-text
          drop-shadow-xl
          leading-[7rem]
          max-[640px]:leading-[4.5rem]"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
          >
            Awas Imsak!
          </p>
          <div
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
              className="opensans text-[15px] mt-5"
            />
          </div>
          <p
            className="poppins-medium 
        mt-8 max-[640px]:text-[13px] w-[36rem] max-[640px]:w-[18rem]"
            data-aos="fade-up"
            data-aos-delay="1400"
            data-aos-duration="1000"
          >
            Rasulullah saw bersabda:
            <br />
            <br />
            ثَلَاثُ دَعَوَاتٍ مُسْتَجَابَاتٍ ؛دَعْوَةُ الصَّائِمِ وَدَعْوَةُ
            الْمُسَافِرِ وَدَعْوَةُ الْمَظْلُوْمِ
            <br />
            <br />
            Artinya: Ada tiga macam doa yang mustajab, yaitu doa orang yang
            sedang puasa, doa musafir, dan doa orang yang teraniaya (HR
            Baihaqi).
          </p>
          <div
            className="mt-5 
        space-x-2 
        max-[640px]:grid-cols-2 
        max-[640px]:grid 
        max-[640px]:space-x-0
        max-[640px]:gap-4
        max-[640px]:justify-center
        max-[640px]:text-[13px]"
          >
            <Link href="/niat">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow "
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                Awas Lupa Niat
              </motion.button>
            </Link>
            <Link href="/tadarus">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 1 }}
              >
                Awas Lupa Tadarus
              </motion.button>
            </Link>
            <Link href="/resep">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                Awas Lupa Masak
              </motion.button>
            </Link>
          </div>
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 2.5,
              duration: 1.5,
              type: "spring",
            }}
          >
            <p className="text-[12px] italic">
              © {new Date().getFullYear()}{" "}
              <Link
                href="https://github.com/klawcodes"
                rel="noopener noreferrer"
                target="_blank"
                className="underline"
              >
                {" "}
                Muhammad Dimas,{" "}
              </Link>
              under RIOT REVENGER exclusive agreements.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col w-[50rem] max-[640px]:w-[20rem]">
          <div
            className="flex mb-5 border border-[#0d2818] rounded-full bg-[#0d1811] overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
          >
            {/* Left side - Timezone */}
            <div className="flex-1 p-4 text-center border-r border-[#0d2818]">
              <p className="text-xl max-[640px]:text-lg opensans">
                {localTimeZone}
              </p>
            </div>

            {/* Right side - Weather 
            <div className="flex-1 p-4 text-center">
              <p className="text-xl max-[640px]:text-lg opensans">-</p>
            </div> */}
          </div>
          <h1
            className="text-2xl poppins-extrabold mb-4 max-[640px]:text-lg"
            data-aos="fade-up"
            data-aos-delay="1100"
            data-aos-duration="1000"
          >
            Pilih Wilayah:
          </h1>
          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-duration="1000"
            className="z-[999]"
          >
            <Select
              options={locations}
              value={selectedLocation}
              onChange={handleLocationChange}
              placeholder={
                isLoading ? "Mendeteksi lokasi..." : "Cari lokasi..."
              }
              isDisabled={isLoading}
              isClearable
              className="poppins-regular mb-4 hover:cursor-text text-black"
            />
          </div>
          {prayerSchedule && (
            <div className="poppins-regular text-[20px]">
              <div className="flex justify-between">
                <div
                  className="flex flex-col mb-5 max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1300"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Wilayah:</span>
                  <span>{selectedLocation && selectedLocation.label}</span>
                </div>
                <div
                  className="flex flex-col mb-5 max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Hari / Tanggal:</span>
                  <span>{prayerSchedule.tanggal}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 max-[640px]:grid-cols-2">
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Imsak:</span>
                  <span>{prayerSchedule.imsak}</span>
                </div>

                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1500"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Subuh:</span>
                  <span>{prayerSchedule.subuh}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1600"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Terbit:</span>
                  <span>{prayerSchedule.terbit}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1700"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Dhuha:</span>
                  <span>{prayerSchedule.dhuha}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1800"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Dzuhur:</span>
                  <span>{prayerSchedule.dzuhur}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1900"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Ashar:</span>
                  <span>{prayerSchedule.ashar}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="2000"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Maghrib:</span>
                  <span>{prayerSchedule.maghrib}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="2100"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Isya:</span>
                  <span>{prayerSchedule.isya}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
