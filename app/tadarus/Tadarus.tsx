'use client'

import Quran from "../../components/quran/page";
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Link from 'next/link'

const Tadarus = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center bodi-tadarus -mt-1 w-full max-[640px]:mt-5">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex justify-start w-full pl-[12%] ">
          <div >
            <p className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white py-1 px-3 rounded-full max-[640px]:text-[13px]">
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
        max-[640px]:text-[2.5rem]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
        justify-center
        text-center
        items-center
        max-[360px]:leading-[2.5rem]
      "
          >
            Awas Lupa Tadarus
          </p>
          <p className="text-[15px] max-[640px]:text-[15px] w-[100%] max-[640px]:w-[80%] text-center justify-center">
            Jangan lupa tadarus di sini! Baca quran online, buat gadget anda lebih berfaedah!
          </p>
        </div>
        <div className="flex justify-center mb-1 mt-5">
          <Provider store={store}>
            <Quran />
          </Provider>
        </div>
      </div>
    </>
  );
};

export default Tadarus;