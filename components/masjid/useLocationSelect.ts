"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { Location } from "./selectStyles";

/**
 * Daftar wilayah + deteksi lokasi otomatis (geolocation + OpenCage).
 * Logikanya disalin dari components/hero/page.tsx supaya hasilnya sama persis.
 */
export function useLocationSelect() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (): Promise<Location[]> => {
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
              { id: "lokasi-terdeteksi", duration: 4000 },
            );
          } else {
            toast.error(
              "Lokasi terdeteksi tetapi tidak ada dalam daftar yang tersedia",
              { id: "lokasi-tidak-ada", duration: 4000 },
            );
            setSelectedLocation(locations[50] ?? null); // Default location
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          toast.error("Gagal mengambil detail lokasi dari server", {
            id: "lokasi-server",
            duration: 4000,
          });
          setSelectedLocation(locations[50] ?? null);
        }
      } catch (error) {
        console.error("Geolocation Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Gagal mendeteksi lokasi",
          { id: "lokasi-geolocation", duration: 4000 },
        );
        setSelectedLocation(locations[50] ?? null);
      }
    } else {
      toast.error("Browser tidak mendukung geolocation", {
        id: "lokasi-browser",
        duration: 4000,
      });
      setSelectedLocation(locations[50] ?? null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const list = await fetchData();
      await detectAndSetLocation(list);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { locations, selectedLocation, setSelectedLocation, isLoading };
}
