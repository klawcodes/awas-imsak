'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBookOpen, faSearch } from '@fortawesome/free-solid-svg-icons';

interface Resep {
  title: string;
  time: string;
  difficulty: string;
  'image-src': string;
  'link-href': string;
}

const Resep: React.FC = () => {
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const resepPerPage = 6;
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);
  const [marginPagesDisplayed, setMarginPagesDisplayed] = useState(2);

  useEffect(() => {
    fetch('https://mahi-api.cyclic.app/makanMalam')
      .then(response => response.json())
      .then((data: Resep[]) => setResepList(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Fungsi untuk melakukan filter berdasarkan keyword pencarian
  const filteredResep = resepList.filter(resep =>
    resep.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Menampilkan resep sesuai halaman yang dipilih
  const indexOfLastResep = (currentPage + 1) * resepPerPage;
  const indexOfFirstResep = indexOfLastResep - resepPerPage;
  const currentResep = filteredResep.slice(indexOfFirstResep, indexOfLastResep);

  // Mengubah nilai pageRangeDisplayed berdasarkan lebar layar
  useEffect(() => {
    const handleResize = () => {
      setPageRangeDisplayed(window.innerWidth <= 640 ? 2 : 5);
      setMarginPagesDisplayed(window.innerWidth <= 640 ? 0 : 2);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center px-5 py-10 bodi-resep">
        <Link
          href="/"
          className="flex justify-start w-[32rem] max-[640px]:w-[17rem]"
        >
          <div>
            <p className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white py-1 px-3 rounded-full max-[640px]:text-[13px]">
              ⬅ Back to Home
            </p>
          </div>
        </Link>
        <p
          className="
        bg-gradient-to-r 
        from-[#4f772d] 
        to-[#aad576] 
        inline-block 
        monas
        text-[4rem]
        max-[640px]:text-[2rem]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
      "
        >
          Awas Lupa Masak
        </p>
        <p className="max-[640px]:text-[12px] justify-center text-center">
          Masa udah puasa malah ga buka gara-gara ga masak.
        </p>
        <div>
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Cari masakan....."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-[#0d1811] border border-[#3e664e] text-white px-10 py-2 rounded-lg w-[20%] mb-4 mt-5 max-[640px]:w-[60%]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-white" />
              </div>
            </div>
          </div>

          {/* Menampilkan pesan jika hasil pencarian tidak ditemukan */}
          {filteredResep.length === 0 && (
            <div className="bg-[#0d1811] border border-[#3e664e] p-4 rounded-2xl w-[810px] max-[640px]:w-[300px] flex flex-col justify-center items-center text-center">
              <p>Yah... masakannya ga ketemu, coba cari yang lain dehh</p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 w-full max-w-screen-lg mt-5 max-[640px]:grid-cols-1">
            {currentResep.map((resep, index) => (
              <div
                key={index}
                className="bg-[#0d1811] border border-[#3e664e] p-4 rounded-2xl w-full flex flex-col justify-center items-center text-center"
              >
                <Link href={resep["link-href"]}>
                  <Image
                    src={resep["image-src"]}
                    alt={resep.title}
                    loading="lazy"
                    width={500}
                    height={500}
                    className="rounded-2xl mb-2 filter hover:grayscale transition-colors duration-300 ease-in-out"
                  />
                </Link>
                <h2 className="text-lg font-semibold mb-10">{resep.title}</h2>
                <div className="flex w-full justify-between info mt-auto">
                  <div className="text-sm text-white bg-[#0d1811] border border-[#3e664e] p-2 rounded-full active-shadow">
                    <FontAwesomeIcon icon={faClock} />{" "}
                    {resep.time ? resep.time : " -"}
                  </div>
                  <div className="text-sm text-white bg-[#0d1811] border border-[#3e664e] p-2 rounded-full mb-1 active-shadow">
                    {resep.difficulty ? resep.difficulty : " -"}
                  </div>
                  <Link
                    href={resep["link-href"]}
                    className="text-sm text-center justify-center items-center text-white bg-[#0d1811] border border-[#3e664e] hover:border-[#65a77f] transition-colors duration-300 ease-in-out  py-2 px-3 rounded-full active-shadow"
                  >
                    <FontAwesomeIcon icon={faBookOpen} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tampilkan penomoran halaman */}
        <ReactPaginate
          pageCount={Math.ceil(resepList.length / resepPerPage)}
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
  );
};

export default Resep;
