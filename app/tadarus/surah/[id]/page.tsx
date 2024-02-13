'use client'

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SurahDetail from '../../../../components/surahDetail/page';

interface Ayah {
    number: {
        inquran: number;
        insurah: number;
    };
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: {
        recommended: boolean;
        obligatory: boolean;
    };
    text: {
        ar: string;
        read: string;
    };
    translation: {
        en: string;
        id: string;
    };
    tafsir: {
        id: string;
        en: string | null;
    };
    audio: {
        url: string;
    };
}

// Definisikan struktur data surah
interface SurahData {
    number: number;
    ayahCount: number;
    sequence: number;
    asma: {
        ar: {
            short: string;
            long: string;
        };
        en: {
            short: string;
            long: string;
        };
        id: {
            short: string;
            long: string;
        };
        translation: {
            en: string;
            id: string;
        };
    };
    preBismillah: any;
    type: {
        ar: string;
        id: string;
        en: string;
    };
    tafsir: {
        id: string;
        en: string | null;
    };
    recitation: {
        full: string;
    };
    ayahs: Ayah[];
}

const SurahDetails: React.FC = () => {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const surahId = searchParams.get('surahId')
    const [surahData, setSurahData] = useState<any | null>(null);

    {/* useEffect(() => {
      // Cek apakah sedang berada di lingkungan klien
      if (typeof window !== "undefined" && surahId) {
        const fetchSurahData = async () => {
          try {
            const response = await fetch(
              `https://quran-endpoint.vercel.app/quran/${surahId}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setSurahData(data);
          } catch (error) {
            console.error("Error fetching surah data:", error);
          }
        };

        fetchSurahData();
      }
      // Mendapatkan URL saat ini
      //const currentURL = window.location.href;

      // Memisahkan URL berdasarkan tanda '/' (slash)
      //const urlParts = currentURL.split("/");

      // Mengambil parameter terakhir
      //const lastParam = urlParts[urlParts.length - 1];

      //console.log(lastParam); // Ini akan mencetak keluar "1?"

      //const url = `${pathname}?${searchParams}`
      //console.log(url)
    }, [pathname, searchParams, surahId]);*/}


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentURL = window.location.href;

            const urlParts = currentURL.split('/');

            const surahId = urlParts[urlParts.length - 1];

            const fetchSurahData = async () => {
                try {
                    const response = await fetch(`https://quran-endpoint.vercel.app/quran/${surahId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setSurahData(data);
                } catch (error) {
                    console.error('Error fetching surah data:', error);
                }
            };

            if (surahId) {
                fetchSurahData();
            }
        }
    }, []);
    
    if (!surahData) {
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw", // Menggunakan viewport width
                height: "100vh", // Menggunakan viewport height
              }}
            >
              <div className="rounded-md h-12 w-12 border-4 border-t-4 border-[#3e664e] animate-spin"></div>
            </div>
          </>
        );
    }
    
    const { ayahs } = surahData.data;
    const allAyahTextsRead = ayahs.map((ayah: { text: any }) => ayah.text.read);
    const allAyahTextsAr = ayahs.map((ayah: { text: any }) => ayah.text.ar);
    const allAyahAudio = ayahs.map((ayah: { audio: any }) => ayah.audio.url);
    
    return (
        <div className="container">
            <div className="container">
                <h1>{surahData.data.asma.id.short}</h1>
                <p>{surahData.data.ayahCount} Ayat</p>
                <p>Jenis Surah: {surahData.data.type.id}</p>
                <p>Tafsir: {surahData.data.tafsir.id}</p>
                <p>
                    Audio: <a href={surahData.data.recitation.full}>Dengarkan</a>
                </p>
            </div>
            <div>
                <ul>
                    {allAyahTextsAr.map((text: string, index: number) => (
                        <li key={index}>
                            <div>{text}</div>
                            <div>{allAyahTextsRead[index]}</div>
                            <div><a href={allAyahAudio[index]}>Dengarkan</a></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
};

export default SurahDetails;
