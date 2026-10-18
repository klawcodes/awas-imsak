import React from "react";
import type { Metadata } from "next";
import Masjid from "./Masjid";

export const metadata: Metadata = {
  title: "Awas Imsak! - Tampilan TV Masjid / Mushola",
  description:
    "Tampilkan jadwal sholat khusus untuk masjid atau mushola Anda di layar TV.",
};

const MasjidPage = () => {
  return (
    <div>
      <Masjid />
    </div>
  );
};

export default MasjidPage;
