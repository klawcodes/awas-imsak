"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SurahDetail from "../../../../components/surahDetail/page";
import Link from 'next/link'
import Image from 'next/image'

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

  
  

  return (
    <div className="flex flex-col justify-center items-center w-screen px-[3.5rem] py-[1rem]">
      <div className="text-center">
        <div className="flex justify-center space-x-[4rem] items-center py-3">
          {surahData && surahData.data.number !== 1 && (
            <button
              className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded"
              onClick={() => navigateToSurah(surahData.data.number - 1)}
              disabled={surahData.data.number === 1}
            >
              ⬅
            </button>
          )}
          <Link href="/tadarus">
            <Image
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='white' d='M2.614 5.426A1.5 1.5 0 0 1 4 4.5h10a7.5 7.5 0 1 1 0 15H5a1.5 1.5 0 0 1 0-3h9a4.5 4.5 0 1 0 0-9H7.621l.94.94a1.5 1.5 0 0 1-2.122 2.12l-3.5-3.5a1.5 1.5 0 0 1-.325-1.634'/%3E%3C/g%3E%3C/svg%3E"
              alt="x"
              style={Icons}
              width={0}
              height={0}
              className="mb-2"
            />
          </Link>
          <Link href="/">
            <Image
              src="/img/bxs-home.svg"
              alt="x"
              style={Icons}
              width={0}
              height={0}
              className="mb-2"
            />
          </Link>
          {surahData && surahData.data.number !== 114 && (
            <button
              className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded"
              onClick={() => navigateToSurah(surahData.data.number + 1)}
            >
              ➡
            </button>
          )}
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
        max-[640px]:text-[5.5rem]
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
            className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded-full w-[25rem] active-shadow"
            onClick={() => setShowTafsir(!showTafsir)}
          >
            {showTafsir ? "Sembunyikan Tafsir" : "Tampilkan Tafsir"}
          </button>

          {showTafsir && (
            <div className="mt-2 p-4 shadow-md flex flex-col justify-center items-center text-center bg-[#0d1811] border border-[#3e664e] rounded-2xl active-shadow">
              <p className="text-lg font-bold mb-2">Tafsir:</p>
              <p className="w-[20rem]">{surahData.data.tafsir.id}</p>
            </div>
          )}
        </div>

        <audio
          controls
          className="w-full justify-center items-center max-w-md rounded-lg p-2"
        >
          <source src={surahData.data.recitation.full} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div>
        <ul>
          <div className="my-5 bg-[#0d1811] border border-[#3e664e] p-5 w-[35rem] rounded-3xl justify-center text-center active-shadow">
            <p className="text-3xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم</p>
            <p className="mt-5">Bismillahirrahmanirrahim</p>
          </div>
          {allAyahTextsAr.map((text: string, index: number) => (
            <div
              className="my-5 bg-[#0d1811] border border-[#3e664e] p-5 w-[35rem] rounded-3xl active-shadow"
              key={index}
            >
              <div className="flex justify-between text-center">
                <div className="bg-[#0d1811] border border-[#3e664e] w-[35px] h-[35px] p-1 rounded-full">
                  {allAyahNumbers[index]}
                </div>
                <div className="text-end text-3xl mb-5">{text}</div>
              </div>
              <div className="font-bold">{allAyahTextsRead[index]}</div>
              <div>{allAyahTransId[index]}</div>
              <div></div>
              <div>
                <a href={allAyahAudio[index]}>Dengarkan</a>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div className="flex justify-center space-x-[4rem] items-center py-3">
        {surahData && surahData.data.number !== 1 && (
          <button
            className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded"
            onClick={() => navigateToSurah(surahData.data.number - 1)}
            disabled={surahData.data.number === 1}
          >
            ⬅
          </button>
        )}
        <Link href="/tadarus">
            <Image
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='white' d='M2.614 5.426A1.5 1.5 0 0 1 4 4.5h10a7.5 7.5 0 1 1 0 15H5a1.5 1.5 0 0 1 0-3h9a4.5 4.5 0 1 0 0-9H7.621l.94.94a1.5 1.5 0 0 1-2.122 2.12l-3.5-3.5a1.5 1.5 0 0 1-.325-1.634'/%3E%3C/g%3E%3C/svg%3E"
              alt="x"
              style={Icons}
              width={0}
              height={0}
              className="mb-2"
            />
          </Link>
        <Link href="/">
            <Image
              src="/img/bxs-home.svg"
              alt="x"
              style={Icons}
              width={0}
              height={0}
              className="mb-2"
            />
          </Link>
        {surahData && surahData.data.number !== 114 && (
          <button
            className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white font-bold py-2 px-4 rounded"
            onClick={() => navigateToSurah(surahData.data.number + 1)}
          >
            ➡
          </button>
        )}
      </div>
    </div>
  );
};

export default SurahDetails;
