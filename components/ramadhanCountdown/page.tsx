'use client'

import React, { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const RamadhanCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Inisialisasi isVisible dari localStorage atau default ke true
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('countdownVisible');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  // Effect untuk menangani setTimeout initial display
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Effect untuk menyimpan state visibility ke localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('countdownVisible', JSON.stringify(isVisible));
    }
  }, [isVisible]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const ramadhanDate = new Date('2025-03-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = ramadhanDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[99999] bg-[#0d1811] border border-[#3e664e] p-6 rounded-lg shadow-lg max-w-sm animate-fade-in">
      <button 
        onClick={handleClose}
        className="absolute top-2 left-2 text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1a2e22]"
      >
        ×
      </button>
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Ramadhan 2025 / 1446 H</h2>
        <p className="text-sm mb-4 text-gray-400">
          1 Maret 2025
        </p>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#1a2e22] p-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-sm text-gray-400">Hari</div>
          </div>
          <div className="bg-[#1a2e22] p-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-sm text-gray-400">Jam</div>
          </div>
          <div className="bg-[#1a2e22] p-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-400">Menit</div>
          </div>
          <div className="bg-[#1a2e22] p-2 rounded-lg">
            <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-400">Detik</div>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-400">
          &quot;What makes your sorry different from all your other sorrys before?&quot;
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Awas Imsak! © {new Date().getFullYear()}{" "}
        </p>
      </div>
    </div>
  );
};

export default RamadhanCountdown;