'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurahDataSuccess } from '../../redux/surahActions';
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
  const surahsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const surahList = [];
        for (let i = 1; i <= 113; i++) {
          const response = await fetch(`https://quran-endpoint.vercel.app/quran/${i}`);
          const data = await response.json();
          surahList.push(data.data);
        }
        dispatch(fetchSurahDataSuccess(surahList));
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


      

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="rounded-md h-12 w-12 border-4 border-t-4 border-[#3e664e] animate-spin absolute"></div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              {currentSurahs.map((surahData: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#0d1811] border border-[#3e664e] px-4 py-3 rounded-lg"
                >
                  <div className="flex justify-between space-x-[5rem]">
                    <p className="text-white font-bold text-lg mb-2">
                      {surahData.asma.id.short}
                    </p>
                    <p className="text-white">{surahData.asma.ar.short}</p>
                  </div>
                  <p className="text-white">{surahData.asma.translation.id}</p>
                </div>
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
          </>
        )}
      </div>
    </>
  );
}

export default Quran
