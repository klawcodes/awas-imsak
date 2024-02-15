'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons';

interface Resep {
  title: string;
  time: string;
  difficulty: string;
  'image-src': string;
  'link-href': string;
}

const Resep: React.FC = () => {
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const resepPerPage = 6;

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


  // Menampilkan resep sesuai halaman yang dipilih
  const indexOfLastResep = (currentPage + 1) * resepPerPage;
  const indexOfFirstResep = indexOfLastResep - resepPerPage;
  const currentResep = resepList.slice(indexOfFirstResep, indexOfLastResep);

  return (
    <div className="flex flex-col justify-center items-center px-5 py-10">
      <Link href="/" className="flex justify-start w-[32rem]">
        <div>
          <p className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white py-1 px-3 rounded-full">
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
        max-[640px]:text-[5.5rem]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
      "
      >
        Awas Lupa Buka
      </p>
      <p>
        Masa udah puasa malah ga buka gara-gara ga masak, dua kata lucu
        &quot;Lupa Buka&quot;
      </p>
      <div className="grid grid-cols-3 gap-4 w-full max-w-screen-lg mt-5">
        {currentResep.map((resep, index) => (
          <div
            key={index}
            className="bg-[#0d1811] border border-[#3e664e] p-4 rounded-2xl w-full flex flex-col"
          >
            <Image
              src={resep["image-src"]}
              alt={resep.title}
              width={500}
              height={500}
              className="rounded-2xl mb-2"
            />
            <h2 className="text-lg font-semibold mb-2">{resep.title}</h2>
            <div className="flex w-full justify-between mt-5 info">
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
      {/* Tampilkan penomoran halaman */}
      <ReactPaginate
        pageCount={Math.ceil(resepList.length / resepPerPage)}
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
  );
};

export default Resep;
