"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from 'next/link'
import Select from "react-select";
import Textra from "react-textra";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from 'framer-motion';
import Notification from '../notification/page';

const Hero = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [locations, setLocations] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    value: string;
    label: string;
  } | null>({
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
  const [localTimeZone, setLocalTimeZone] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mendapatkan offset dari UTC
    const offsetMinutes = -currentTime.getTimezoneOffset();
    const offsetHours = Math.floor(offsetMinutes / 60);

    // Set zona waktu lokal
    let timeZone = "";
    if (offsetHours === 7) {
      timeZone = "WIB";
    } else if (offsetHours === 8) {
      timeZone = "WITA";
    } else if (offsetHours === 9) {
      timeZone = "WIT";
    }

    // Format waktu
    const formattedTime = `${formatTime(currentTime.getHours())}:${formatTime(
      currentTime.getMinutes()
    )}:${formatTime(currentTime.getSeconds())}`;

    // Set keterangan zona waktu lokal
    const timeZoneInfo = `UTC+${offsetHours} | ${formattedTime} ${timeZone}`;

    setLocalTimeZone(timeZoneInfo);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  };
  const [showNotification, setShowNotification] = useState(true); // Ubah menjadi true agar notifikasi langsung muncul

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="bodi-hero">
      {showNotification && (
        <Notification message="Selamat hari raya idul fitri 1445 H 🙏 " onClose={handleCloseNotification} />
      )}
      <div className="px-[3.5rem] py-[1rem] flex max-[640px]:flex-col max-[640px]:py-[2rem] max-[640px]:space-y-10 justify-between items-center h-screen">
        <div className="flex flex-col">
          <Image
            src="/img/bunderan.png"
            sizes="100vw"
            style={{
              width: "30%",
              height: "auto",
            }}
            width={250}
            height={250}
            alt="lantern"
            className="rounded-3xl max-[640px]:mb-5"
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-duration="1000"
          />

          <p
            className="
          bg-gradient-to-r 
          from-[#4f772d] 
          to-[#aad576] 
          inline-block 
          monas
          text-[8rem]
          max-[640px]:text-[5.5rem]
          text-transparent 
          bg-clip-text
          drop-shadow-xl
          leading-[7rem]
          max-[640px]:leading-[4.5rem]"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
          >
            Awas <br /> Imsak!
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-duration="1000"
          >
            <Textra
              effect="downTop"
              duration={500}
              data={[
                "Awas Imsak! hadir untuk teman-teman yang suka sahur jam 12 siang",
                "Masa puasa 30 hari doang ga bisa sih bang?",
                "Awas Imsak! Puasa Tenang, Hati Gembirang.",
              ]}
              className="opensans text-[15px]"
            />
          </div>
          <p
            className="poppins-medium 
        mt-8 max-[640px]:text-[13px] w-[36rem] max-[640px]:w-[18rem]"
            data-aos="fade-up"
            data-aos-delay="1400"
            data-aos-duration="1000"
          >
            Dari Abu Hurairah RA berkata, Rasulullah SAW bersabda: &quot;Siapa
            berpuasa di bulan Ramadan dengan dilandasi iman dan ikhlas mengharap
            ridha Allah, maka diampuni dosanya yang lalu,&quot; (HR Al-Bukhari)
          </p>
          <div
            className="mt-5 
        space-x-2 
        max-[640px]:grid-cols-2 
        max-[640px]:grid 
        max-[640px]:space-x-0
        max-[640px]:gap-4
        max-[640px]:justify-center
        max-[640px]:text-[13px]"
          >
            <Link href="/niat">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow "
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                Awas Lupa Niat
              </motion.button>
            </Link>
            <Link href="/tadarus">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 1 }}
              >
                Awas Lupa Tadarus
              </motion.button>
            </Link>
            <Link href="/resep">
              <motion.button
                className="bg-[#0d1811] border border-[#3e664e] hover:border-[#2b4733] transition-colors text-white rounded-full px-5 w-auto h-10 active-box active-shadow"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                Awas Lupa Masak
              </motion.button>
            </Link>
          </div>
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 2.5,
              duration: 1.5,
              type: "spring",
            }}
          >
            <p className="text-[12px] italic">
              © 2024
              <Link
                href="https://github.com/klawcodes"
                rel="noopener noreferrer"
                target="_blank"
                className="underline"
              >
                {" "}
                KLAW,{" "}
              </Link>
              under RIOT REVENGER exclusive agreements.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col w-[50rem] max-[640px]:w-[20rem]">
          <div
            className="
        flex 
        space-x-1 
        text-3xl
        max-[640px]:text-lg
        mb-5 
        border 
        border-[#0d2818] 
        p-4 
        rounded-full 
        text-center justify-center items-center bg-[#0d1811]"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="1000"
          >
            <p className="opensans">{localTimeZone}</p>
          </div>
          <h1
            className="text-2xl poppins-extrabold mb-4 max-[640px]:text-lg"
            data-aos="fade-up"
            data-aos-delay="1100"
            data-aos-duration="1000"
          >
            Pilih Wilayah:
          </h1>
          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            data-aos-duration="1000"
            className="z-[999]"
          >
            <Select
              options={locations}
              value={selectedLocation}
              onChange={handleLocationChange}
              placeholder="Cari lokasi..."
              isClearable
              className="poppins-regular mb-4 hover:cursor-text text-black"
            />
          </div>
          {prayerSchedule && (
            <div className="poppins-regular text-[20px]">
              <div className="flex justify-between">
                <div
                  className="flex flex-col mb-5 max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1300"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Wilayah:</span>
                  <span>{selectedLocation && selectedLocation.label}</span>
                </div>
                <div
                  className="flex flex-col mb-5 max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Hari / Tanggal:</span>
                  <span>{prayerSchedule.tanggal}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 max-[640px]:grid-cols-2">
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Imsak:</span>
                  <span>{prayerSchedule.imsak}</span>
                </div>

                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1500"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Subuh:</span>
                  <span>{prayerSchedule.subuh}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1600"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Terbit:</span>
                  <span>{prayerSchedule.terbit}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1700"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Dhuha:</span>
                  <span>{prayerSchedule.dhuha}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1800"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Dzuhur:</span>
                  <span>{prayerSchedule.dzuhur}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="1900"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Ashar:</span>
                  <span>{prayerSchedule.ashar}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-box active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="2000"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Maghrib:</span>
                  <span>{prayerSchedule.maghrib}</span>
                </div>
                <div
                  className="flex flex-col border border-[#0d2818] p-4 rounded-md active-shadow max-[640px]:text-lg"
                  data-aos="fade-up"
                  data-aos-delay="2100"
                  data-aos-duration="1000"
                >
                  <span className="font-semibold">Isya:</span>
                  <span>{prayerSchedule.isya}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
