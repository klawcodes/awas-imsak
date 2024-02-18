'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurahDataSuccess } from '../../redux/surahActions';
import Link from 'next/link'
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const Quran = () => {
  interface SurahData {
    number: number;
    ayahCount: number;
    sequence: number;
    asma: {
        ar: { short: string; long: string };
        en: { short: string; long: string };
        id: { short: string; long: string };
        translation: { en: string; id: string };
    };
}
      
      

  const dispatch = useDispatch();
  const surahDataList = useSelector((state: any) => state.surah.surahDataList);
  const surahsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showText,  setShowText] = useState(false);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
  const [marginPagesDisplayed, setmarginPagesDisplayed] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cek apakah data sudah ada di localStorage
        const cachedData = localStorage.getItem('surahDataList');
        if (cachedData) {
          dispatch(fetchSurahDataSuccess(JSON.parse(cachedData)));
        } else {
          const surahList = [];
          for (let i = 1; i <= 114; i++) {
            const response = await fetch(`https://quran-endpoint.vercel.app/quran/${i}`);
            const data = await response.json();
            surahList.push(data.data);
          }
          dispatch(fetchSurahDataSuccess(surahList));
  
          // Simpan data ke localStorage
          localStorage.setItem('surahDataList', JSON.stringify(surahList));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch]);
  

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  // Fungsi untuk menangani perubahan nilai pada input pencarian
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value);
};

// Logika untuk pemfilteran data surah berdasarkan input pencarian
useEffect(() => {
  const results = surahDataList.filter((surahData: any) => {
    return surahData.asma.id.short.toLowerCase().includes(searchTerm.toLowerCase());
  });
  setSearchResults(results);
}, [searchTerm, surahDataList]);


// Ubah bagian pengaturan currentSurahs
const indexOfLastSurah = (currentPage + 1) * surahsPerPage;
const indexOfFirstSurah = indexOfLastSurah - surahsPerPage;
const currentSurahs = searchResults.slice(indexOfFirstSurah, indexOfLastSurah);


  // Setelah 30 detik, tampilkan teks
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 14000); // 30 detik

    return () => clearTimeout(timer);
  }, []);

  // Jika loading selesai, sembunyikan teks
  useEffect(() => {
    if (!loading) {
      setShowText(false);
    }
  }, [loading]);

  useEffect(() => {
    const handleResize = () => {
      // Mengubah nilai pageRangeDisplayed berdasarkan lebar layar
      if (window.innerWidth <= 640) {
        setPageRangeDisplayed(2);
      } else {
        setPageRangeDisplayed(5);
      }
    };

    window.addEventListener('resize', handleResize);

    // Mengatur nilai awal saat komponen pertama kali dimuat
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Mengubah nilai pageRangeDisplayed berdasarkan lebar layar
      if (window.innerWidth <= 640) {
        setmarginPagesDisplayed(0);
      } else {
        setmarginPagesDisplayed(2);
      }
    };

    window.addEventListener('resize', handleResize);

    // Mengatur nilai awal saat komponen pertama kali dimuat
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pageCount = Math.ceil(searchResults.length / surahsPerPage);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {loading && (
          <div className="w-12 h-12 border-4 border-t-4 border-[#3e664e] animate-spin"></div>
        )}
        {showText && (
          <div className="text-center mt-5">Sabar ya, kan lagi puasaaa....</div>
        )}
        {!loading && !showText && (
          <>
            <div className="flex flex-col max-[640px]:w-[100%]">
              {/* Search bar */}
              <div className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search Surah..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="parent bg-[#0d1811] border border-[#3e664e] text-white px-[2.4rem] py-2 rounded-lg w-[20%] max-[640px]:w-[70%] mb-5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-white -mt-5"
                    />{" "}
                    {/* Tambahkan class -mt-1 */}
                  </div>
                </div>
              </div>

              {searchResults.length === 0 && (
                <div className="bg-[#0d1811] border border-[#3e664e] p-4 rounded-2xl w-[1080px] flex flex-col justify-center items-center text-center">
                  <p>Yah... surahnya ga ketemu, coba cari yang lain dehh</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 parent max-[640px]:grid-cols-1">
                {currentSurahs.map((surahData: any, index: number) => (
                  <Link key={index} href={"/tadarus/surah/" + surahData.number}>
                    <div className="bg-[#0d1811] border border-[#3e664e] px-4 py-3 rounded-lg cursor-pointer">
                      <div className="flex justify-between space-x-[5rem]">
                        <p className="text-white font-bold text-lg mb-2 max-[640px]:text-[20px]">
                          {surahData.asma.id.short}
                        </p>
                        <p className="text-white">{surahData.asma.ar.short}</p>
                      </div>
                      <p className="text-white">
                        {surahData.asma.translation.id}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={pageRangeDisplayed}
                marginPagesDisplayed={marginPagesDisplayed}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeLinkClassName={"active"}
                previousLabel={<span>&#8592;</span>}
                nextLabel={<span>&#8594;</span>}
                breakLabel={"..."}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                disabledClassName={"disabled"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Quran
