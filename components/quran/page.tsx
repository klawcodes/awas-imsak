'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurahDataSuccess } from '../../redux/surahActions';
import Link from 'next/link'
import ReactPaginate from 'react-paginate';


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
          for (let i = 1; i <= 113; i++) {
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

  const indexOfLastSurah = (currentPage + 1) * surahsPerPage;
  const indexOfFirstSurah = indexOfLastSurah - surahsPerPage;
  const currentSurahs = surahDataList.slice(indexOfFirstSurah, indexOfLastSurah);

  // Setelah 30 detik, tampilkan teks
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 10000); // 30 detik

    return () => clearTimeout(timer);
  }, []);

  // Jika loading selesai, sembunyikan teks
  useEffect(() => {
    if (!loading) {
      setShowText(false);
    }
  }, [loading]);

      

  return (
    <>
      <div className="container flex flex-col justify-center items-center">
        {loading && (
          <div className="w-12 h-12 border-4 border-t-4 border-[#3e664e] animate-spin"></div>
        )}
        {showText && (
          <div className="text-center mt-5">Sabar ya, kan lagi puasaaa....</div>
        )}
        {!loading && !showText && (
          <>
            <div className='flex flex-col'>
              <div className="grid grid-cols-4 gap-4">
                {currentSurahs.map((surahData: any, index: number) => (
                  <Link key={index} href={"/tadarus/surah/" + surahData.number}>
                    <div className="bg-[#0d1811] border border-[#3e664e] px-4 py-3 rounded-lg cursor-pointer">
                      <div className="flex justify-between space-x-[5rem]">
                        <p className="text-white font-bold text-lg mb-2">
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

              <ReactPaginate
                pageCount={Math.ceil(surahDataList.length / surahsPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
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
