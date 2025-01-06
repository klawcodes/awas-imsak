'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSurahDataSuccess } from '../../redux/surahActions';
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Dynamically import ReactPaginate with no SSR
const ReactPaginate = dynamic(() => import('react-paginate'), {
  ssr: false
});

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

// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px]">
    <div className="w-12 h-12 border-4 border-t-4 border-[#3e664e] animate-spin"></div>
    <div className="text-center mt-3">Loading...</div>
  </div>
);

// Main content component
const QuranContent = ({ 
  loadedSurahs,
  searchResults,
  currentSurahs,
  loading,
  loadingProgress,
  searchTerm,
  handleSearch,
  handlePageChange,
  pageCount,
  surahsPerPage,
  pageRangeDisplayed,
  marginPagesDisplayed
}: any) => {
  return (
    <div className="flex flex-col max-[640px]:w-[100%]">
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
            <FontAwesomeIcon icon={faSearch} className="text-white -mt-5" />
          </div>
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="bg-[#0d1811] border border-[#3e664e] p-4 rounded-2xl w-[1080px] flex flex-col justify-center items-center text-center">
          <p>Yah... surahnya ga ketemu, coba cari yang lain dehh</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 parent max-[640px]:grid-cols-1">
          {currentSurahs.map((surahData: SurahData) => (
            <Link key={surahData.number} href={"/tadarus/surah/" + surahData.number}>
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
      )}

      {loadedSurahs.length > surahsPerPage && (
        <div className="mt-4">
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
      )}
    </div>
  );
};

const Quran = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [surahsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadedSurahs, setLoadedSurahs] = useState<SurahData[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
  const [marginPagesDisplayed, setMarginPagesDisplayed] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SurahData[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        const cachedData = localStorage.getItem('surahDataList');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          dispatch(fetchSurahDataSuccess(parsedData));
          setLoadedSurahs(parsedData);
          setSearchResults(parsedData);
        } else {
          const newSurahs: SurahData[] = [];
          for (let i = 1; i <= 114; i++) {
            try {
              const response = await fetch(`https://quran-endpoint.vercel.app/quran/${i}`);
              const data = await response.json();
              newSurahs.push(data.data);
              setLoadingProgress(Math.round((i / 114) * 100));
            } catch (error) {
              console.error(`Error fetching surah ${i}:`, error);
            }
          }
          
          setLoadedSurahs(newSurahs);
          setSearchResults(newSurahs);
          localStorage.setItem('surahDataList', JSON.stringify(newSurahs));
          dispatch(fetchSurahDataSuccess(newSurahs));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      setPageRangeDisplayed(window.innerWidth <= 640 ? 2 : 5);
      setMarginPagesDisplayed(window.innerWidth <= 640 ? 0 : 2);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const results = loadedSurahs.filter((surahData: SurahData) =>
      surahData.asma.id.short.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, loadedSurahs, mounted]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastSurah = (currentPage + 1) * surahsPerPage;
  const indexOfFirstSurah = indexOfLastSurah - surahsPerPage;
  const currentSurahs = searchResults.slice(indexOfFirstSurah, indexOfLastSurah);
  const pageCount = Math.ceil(searchResults.length / surahsPerPage);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Suspense fallback={<LoadingSpinner />}>
        {loading && loadedSurahs.length === 0 ? (
          <div>
            <div className="w-12 h-12 border-4 border-t-4 border-[#3e664e] animate-spin"></div>
            <div className="text-center mt-3">
              Loading... {loadingProgress}%
            </div>
          </div>
        ) : (
          <QuranContent
            loadedSurahs={loadedSurahs}
            searchResults={searchResults}
            currentSurahs={currentSurahs}
            loading={loading}
            loadingProgress={loadingProgress}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            handlePageChange={handlePageChange}
            pageCount={pageCount}
            surahsPerPage={surahsPerPage}
            pageRangeDisplayed={pageRangeDisplayed}
            marginPagesDisplayed={marginPagesDisplayed}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Quran;