"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SurahDetail from "../../../../components/surahDetail/page";
import AudioButtonAyahs from "../../../../components/audioButtonAyahs/page"
import AudioButtonWithSlider from "../../../../components/audioButton/page"
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowRotateLeft, faHome } from '@fortawesome/free-solid-svg-icons';

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

const Icons = {
    width: '30px',
    height: 'auto',
    '@media (min-width: 360px)': {
      width: '5px' // Ubah lebar gambar saat lebar layar <= 640px
    },
    fill: 'white' // Mengatur warna ikon menjadi putih
  };

const SurahDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const surahId = searchParams.get("surahId");
  const [surahData, setSurahData] = useState<any | null>(null);
  const [showTafsir, setShowTafsir] = useState(false);
  const [previousSurahName, setPreviousSurahName] = useState('');
  const [nextSurahName, setNextSurahName] = useState('');
  const [isOn, setIsOn] = useState(false);
  const [activeAyahs, setActiveAyahs] = useState<number[]>([]);
  


  {
    /* useEffect(() => {
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
    }, [pathname, searchParams, surahId]);*/
  }

  const getPageLocalStorageKey = () => {
    if (typeof window !== "undefined") {
      return `activeAyahs_${window.location.pathname}`;
    }
    return "";
  };

  useEffect(() => {
    const storedData = localStorage.getItem(getPageLocalStorageKey());
    if (storedData) {
      setActiveAyahs(JSON.parse(storedData));
    }
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentURL = window.location.href;

      const urlParts = currentURL.split("/");

      const surahId = urlParts[urlParts.length - 1];

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
  const allAyahTransId = ayahs.map(
    (ayah: { translation: any }) => ayah.translation.id
  );
  const allAyahNumbers = ayahs.map(
    (ayah: { number: any }) => ayah.number.insurah
  );
  const allAyahTextsAr = ayahs.map((ayah: { text: any }) => ayah.text.ar);
  const allAyahAudio = ayahs.map((ayah: { audio: any }) => ayah.audio.url);

  const navigateToSurah = (surahNumber: number) => {
    // Pastikan nomor surah berada dalam rentang yang valid (1-114)
    if (surahNumber >= 1 && surahNumber <= 114) {
      // Lakukan navigasi ke surah tertentu
      window.location.href = `/tadarus/surah/${surahNumber}`;
    }
  };

  

  

  const handleClick = (index: number) => {
    let newActiveAyahs: number[] = [];
    if (activeAyahs.includes(index)) {
      newActiveAyahs = activeAyahs.filter((ayahIndex) => ayahIndex !== index);
    } else {
      newActiveAyahs = [index];
    }
    localStorage.setItem(getPageLocalStorageKey(), JSON.stringify(newActiveAyahs));
    setActiveAyahs(newActiveAyahs);
  };
  


  return (
    <div className="flex flex-col justify-center items-center w-screen px-[3.5rem] py-[1rem]">
      <div className="text-center">
        <div className="flex justify-center space-x-[4rem] items-center py-3 max-[640px]:space-x-[1rem] max-[390px]:space-x-[0.6rem]">
          <Link href="/tadarus/surah/1">
            <div className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] p-2 rounded-2xl max-[640px]:w-[5.5rem] max-[640px]:text-[12px]">
              Al-Fatihah
            </div>
          </Link>
          {surahData && surahData.data.number !== 1 && (
            <>
              <button
                className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-2xl text-center"
                onClick={() => navigateToSurah(surahData.data.number - 1)}
                disabled={surahData.data.number === 1}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </>
          )}
          <Link href="/tadarus">
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </Link>
          <Link href="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          {surahData && surahData.data.number !== 114 && (
            <button
              className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-2xl text-center"
              onClick={() => navigateToSurah(surahData.data.number + 1)}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
          <Link href="/tadarus/surah/114">
            <div className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] p-2 rounded-2xl text-center max-[640px]:w-[5.5rem] max-[640px]:text-[12px]">
              An-Nas
            </div>
          </Link>
        </div>
        <p className="text-[2rem]">{surahData.data.asma.ar.short}</p>
        <p
          className="
                bg-gradient-to-r 
        from-[#4f772d] 
        to-[#aad576] 
        inline-block 
        monas
        text-[4rem]
        max-[640px]:text-[2.5rem]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
                "
        >
          {surahData.data.asma.id.short}
        </p>

        <div className="flex space-x-[10rem] justify-center text-center items-center">
          <p>{surahData.data.ayahCount} Ayat</p>
          <p>{surahData.data.type.id}</p>
        </div>
        <div className="my-5">
          <button
            className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-full w-[25rem] max-[640px]:w-[18rem] max-[414px]:w-[20rem] active-shadow"
            onClick={() => setShowTafsir(!showTafsir)}
          >
            {showTafsir ? "Sembunyikan Tafsir" : "Tampilkan Tafsir"}
          </button>

          {showTafsir && (
            <div className="flex w-full items-center justify-center">
              <div className="mt-2 w-[25rem] max-[640px]:w-[18rem] max-[414px]:w-[20rem] p-4 shadow-md flex flex-col justify-center items-center text-center bg-[#0d1811] border border-[#3e664e] rounded-2xl active-shadow">
                <p className="text-lg font-bold mb-2">Tafsir:</p>
                <p className="w-[20rem] max-[640px]:w-[15rem] max-[414px]:w-[17rem]">{surahData.data.tafsir.id}</p>
              </div>
            </div>
          )}
        </div>
        <AudioButtonWithSlider
          audioSource={surahData.data.recitation.full}
          description=""
        />
      </div>
      <div className="w-[35rem] max-[640px]:w-[20rem]">
        <ul>
          {surahData.data.preBismillah && (
            <div className="my-5 bg-[#0d1811] border border-[#3e664e] p-5 rounded-3xl justify-center text-center active-shadow">
              <p className="text-3xl">{surahData.data.preBismillah.text.ar}</p>
              <p className="mt-5 font-bold">
                {surahData.data.preBismillah.text.read}
              </p>
              <p className="">{surahData.data.preBismillah.translation.id}</p>
            </div>
          )}
          {allAyahTextsAr.map((text: string, index: number) => (
            <div
              className="my-5 bg-[#0d1811] border border-[#3e664e] p-5 rounded-3xl active-shadow"
              key={index}
            >
              <div className="flex justify-between text-center">
                <button
                  key={index}
                  style={{
                    backgroundColor: activeAyahs.includes(index)
                      ? "#4C0000"
                      : "#0d1811",
                  }}
                  className={`border border-[#3e664e] w-[35px] h-[35px] p-1 rounded-full`}
                  onClick={() => handleClick(index)}
                >
                  {allAyahNumbers[index]}
                </button>

                <div className="text-end text-3xl mb-5">{text}</div>
              </div>
              <div className="font-bold">{allAyahTextsRead[index]}</div>
              <div>{allAyahTransId[index]}</div>
              <AudioButtonAyahs audioSource={allAyahAudio[index]} />
            </div>
          ))}
        </ul>
      </div>
      <div className="flex justify-center space-x-[4rem] items-center py-3 max-[640px]:space-x-[1rem] max-[390px]:space-x-[0.6rem]">
        <Link href="/tadarus/surah/1">
          <div className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] p-2 rounded-2xl text-center justify-center max-[640px]:w-[5.5rem] max-[640px]:text-[12px]">
            Al-Fatihah
          </div>
        </Link>
        {surahData && surahData.data.number !== 1 && (
          <>
            <button
              className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-2xl text-center"
              onClick={() => navigateToSurah(surahData.data.number - 1)}
              disabled={surahData.data.number === 1}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </>
        )}
        <Link href="/tadarus">
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </Link>
        <Link href="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        {surahData && surahData.data.number !== 114 && (
          <button
            className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-2xl text-center"
            onClick={() => navigateToSurah(surahData.data.number + 1)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
        <Link href="/tadarus/surah/114">
          <div className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] p-2 rounded-2xl max-[640px]:w-[5.5rem] text-center max-[640px]:text-[12px]">
            An-Nas
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SurahDetails;
