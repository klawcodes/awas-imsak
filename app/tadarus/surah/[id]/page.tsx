import React from 'react'
import type { Metadata } from "next";
import Surah from './Surah'

export const metadata: Metadata = {
    title: "Tadarus - Baca Quran Online",
    description: "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses",
  };

const SurahPage = () => {
  return (
    <div><Surah /></div>
  )
}

export default SurahPage