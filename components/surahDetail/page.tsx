// components/SurahDetail.tsx

// Definisikan struktur data ayah
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

// Komponen SurahDetail
const SurahDetail: React.FC<{ surahData: SurahData }> = ({ surahData }) => {
    console.log(surahData.number);
    return (
        <div className="container">
            <h1>{surahData.ayahCount}</h1>
        </div>
    );
};

export default SurahDetail;
