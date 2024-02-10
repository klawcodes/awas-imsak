"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import Textra from 'react-textra'
import Image from 'next/image'

const Hero = () => {
  const [locations, setLocations] = useState<{ value: string; label: string }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ value: string; label: string } | null>({
    value: "1301", // ID Kota Jakarta
    label: "Kota Jakarta",
  });
  const [prayerSchedule, setPrayerSchedule] = useState<any>(null);
  
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.myquran.com/v2/sholat/kota/semua"
        );
        const data = await response.json();
        const formattedLocations = data.data.map(
          (location: { id: string; lokasi: string }) => ({
            value: location.id,
            label: location.lokasi,
          })
        );
        setLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    // Fetch prayer schedule for Jakarta after component mounts
    if (selectedLocation) {
      fetchPrayerSchedule(selectedLocation.value);
    }
  }, [selectedLocation]);
  
  const fetchPrayerSchedule = async (idKota: string) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Bulan dimulai dari 0 (Januari)
    const day = currentDate.getDate();
  
    try {
      const url = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${year}/${month}/${day}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.data && data.data.jadwal) {
        setPrayerSchedule(data.data.jadwal); // Set jadwal sholat ke state
      } else {
        console.error("Invalid response data:", data);
      }
    } catch (error) {
      console.error("Error fetching prayer schedule:", error);
    }
  };
  
  const handleLocationChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedLocation(selectedOption);
    if (selectedOption) {
      fetchPrayerSchedule(selectedOption.value); // Panggil fungsi fetchPrayerSchedule dengan idKota terpilih
    }
  };
  


  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimeZone, setLocalTimeZone] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mendapatkan offset dari UTC
    const offset = currentTime.getTimezoneOffset() / 60;

    // Konversi ke format GMT
    const gmtString = offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;

    setLocalTimeZone(gmtString);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
};

  const [isLoading, setIsLoading] = useState(false);


  return (
    <div className="px-[3.5rem] py-[1rem] flex justify-between items-center h-screen">
      <div className="flex flex-col">
        <Image
          src="/img/bunderan.png"
          width={200}
          height={200}
          alt="lantern"
          className="rounded-3xl"
        />

        <p
          className="
          bg-gradient-to-r 
          from-[#4f772d] 
          to-[#aad576] 
          inline-block 
          monas
          text-[8rem] 
          text-transparent 
          bg-clip-text
          drop-shadow-xl
          leading-[7rem]"
        >
          Awas <br /> Imsak!
        </p>
        <Textra
          effect="downTop"
          duration={500}
          data={[
            "Awas Imsak! hadir untuk teman-teman yang suka sahur jam 12 siang",
            "Masa puasa 30 hari doang ga bisa sih cuy?",
            "Awas Imsak! Puasa Tenang, Hati Gembirang.",
          ]}
          className="opensans text-[15px]"
        />
        <p className="poppins-medium mt-8">Dari Abu Hurairah RA berkata, Rasulullah SAW bersabda: <br /> "Siapa berpuasa di bulan Ramadan dengan dilandasi iman dan <br /> ikhlas mengharap ridha Allah, maka diampuni dosanya yang lalu," (HR Al-Bukhari)</p>
      </div>

      <div className="flex flex-col w-[40rem]">
        <div className="flex space-x-1 text-3xl mb-5 border border-[#0d2818] p-4 rounded-full text-center justify-center items-center bg-[#0d1811]">
          <p className="opensans">{localTimeZone.replace("GMT-", "GMT +")}</p>
          <p className="opensans">
            {" "}
            | {formatTime(currentTime.getHours())}:
            {formatTime(currentTime.getMinutes())}:
            {formatTime(currentTime.getSeconds())}
          </p>
        </div>
        <h1 className="text-2xl poppins-extrabold mb-4">Pilih Wilayah:</h1>
        <Select
          options={locations}
          value={selectedLocation}
          onChange={handleLocationChange}
          placeholder="Cari lokasi..."
          isClearable
          className="poppins-regular mb-4 hover:cursor-text text-black"
        />
        {prayerSchedule && (
          <div className="poppins-regular text-[20px]">
            <div className="flex justify-between">
              <div className="flex flex-col mb-5">
                <span className="font-semibold">Wilayah:</span>
                <span>{selectedLocation && selectedLocation.label}</span>
              </div>
              <div className="flex flex-col mb-5">
                <span className="font-semibold">Hari / Tanggal:</span>
                <span>{prayerSchedule.tanggal}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow">
                <span className="font-semibold">Imsak:</span>
                <span>{prayerSchedule.imsak}</span>
              </div>

              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Subuh:</span>
                <span>{prayerSchedule.subuh}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Terbit:</span>
                <span>{prayerSchedule.terbit}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Dhuha:</span>
                <span>{prayerSchedule.dhuha}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Dzuhur:</span>
                <span>{prayerSchedule.dzuhur}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Ashar:</span>
                <span>{prayerSchedule.ashar}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow">
                <span className="font-semibold">Maghrib:</span>
                <span>{prayerSchedule.maghrib}</span>
              </div>
              <div className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow">
                <span className="font-semibold">Isya:</span>
                <span>{prayerSchedule.isya}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
