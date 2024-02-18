import React from 'react'
import type { Metadata } from "next";
import Resep from './Resep'

export const metadata: Metadata = {
  title: "Awas Imsak! - Resep masak untuk keluarga.",
  description: "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses",
};

const ResepPage = () => {
  return (
    <div><Resep/></div>
  )
}

export default ResepPage