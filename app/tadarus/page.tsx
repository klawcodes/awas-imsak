'use client'

import Quran from "../../components/quran/page";
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Link from 'next/link'

const Tadarus = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex justify-start w-full pl-[12%] ">
          <div >
            <p className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white py-1 px-3 rounded-full">
              ⬅ Back to Home</p>
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
            Awas Lupa Tadarus
          </p>
          <p className="text-[15px]">
            Ayo, kita bikin Al-Quran jadi kayak nonton Netflix. Baca terus, dari
            ayat ke ayat, sampai dapat rating bintang lima dari Allah!
          </p>
        </div>
        <div className="flex justify-center mb-10 mt-10">
          <Provider store={store}>
            <Quran />
          </Provider>
        </div>
      </div>
    </>
  );
};

export default Tadarus;