'use client'

import { useState, useEffect } from 'react';
import Hero from '../components/hero/page'

export default function Home() {
  
  const [countdown, setCountdown] = useState('');
  const [countdownFinished, setCountdownFinished] = useState(false);

  // state baru untuk control tampil/hilang text
  const [showText, setShowText] = useState(true);

  useEffect(() => {

    const targetDate = new Date('2024-03-11T18:30:00').getTime();

    const timer = setInterval(() => {
    
      const now = new Date().getTime();
    
      const distance = targetDate - now;

      if(distance <= 0) {
      
        clearInterval(timer);
      
        setCountdownFinished(true);
        setShowText(true);

        setTimeout(() => {
          setCountdown('');
          setShowText(false);
        }, 3000);

      } else {

        // hitung countdown
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days} hari ${hours} jam ${minutes} menit ${seconds} detik`);
      }

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // effect untuk handle timeout
  useEffect(() => {
    if(countdownFinished) {
      setTimeout(() => {
        setShowText(false);
      }, 3000);
    }
  }, [countdownFinished]);
  
  return (
    <>
      {/* Tampilkan penomoran halaman {!countdownFinished && (
        <>
          <div className="flex flex-col w-screen h-screen justify-center items-center text-center">
            <p
              className="
        bg-gradient-to-r 
          from-[#4f772d] 
          to-[#aad576] 
          inline-block 
          monas
          text-[4rem]
          max-[640px]:text-[3.5rem]
          max-[640px]:w-[95%]
          text-transparent 
          bg-clip-text
          drop-shadow-xl
          leading-[7rem]
          max-[640px]:leading-[3.5rem]
          text-center"
            >
              {countdown}
            </p>
            <p className="font-bold">Menuju Puasa Ramadhan 1445 H / 2024 M</p>
            <p className='max-[640px]:w-[80%]'>&quot;What makes your sorry different from all your other sorrys before?&quot;</p>
            <div className="flex max-[640px]:flex-col w-full justify-center text-center items-center space-x-1 mt-[2rem]">
              <p
                className="
              bg-gradient-to-r 
                from-[#4f772d] 
                to-[#aad576] 
                inline-block 
                monas
                text-[1.5rem]
                text-transparent 
                bg-clip-text
                drop-shadow-xl
                text-center"
              >
                Awas Imsak!
              </p>
              <p className="text-[1rem] max-[640px]:text-[0.7rem]">
               © 2024 Klaw, under RIOT REVENGER exclusive agreements.
              </p>
            </div>
          </div>
        </>
      )}

      {countdownFinished && showText && (
        <>
          <div className='flex w-screen h-screen justify-center text-center items-center'>
            <p
              className="bg-gradient-to-r 
        from-[#4f772d] 
        to-[#aad576] 
        inline-block 
        monas
        text-[4rem]
        max-[640px]:text-[3.5rem]
        max-[640px]:w-[95%]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
        leading-[7rem]
        max-[640px]:leading-[3.5rem]
        text-center"
            >
              Selamat menunaikan ibadah Puasa!
            </p>
          </div>
        </>
      )}

      {countdownFinished && !showText && <Hero />}*/}
      <Hero/>
    </>
  );
}
