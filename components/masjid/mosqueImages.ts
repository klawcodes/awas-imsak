/**
 * Daftar foto latar masjid untuk tampilan TV.
 *
 * Taruh foto masjid (jpg/webp, idealnya 1920x1080) di folder:
 *   public/img/masjid/
 * lalu daftarkan namanya di bawah ini. Salah satunya dipilih acak
 * setiap kali tampilan TV dibuka.
 *
 * Catatan: gunakan foto yang lisensinya jelas (milik sendiri, Unsplash,
 * Pexels, atau Wikimedia Commons). Foto dari hasil pencarian Google
 * tidak boleh langsung dipakai karena hak ciptanya milik pemotretnya.
 *
 * Kalau daftar kosong / foto gagal dimuat, TV memakai latar gradasi
 * hijau bermotif kubah sebagai cadangan.
 */
export const MOSQUE_IMAGES: string[] = [
  "/img/masjid/masjid-1.jpg",
  // "/img/masjid/masjid-2.jpg",
  // "/img/masjid/masjid-3.jpg",
];

export function pickRandomMosqueImage(): string | null {
  if (MOSQUE_IMAGES.length === 0) return null;
  return MOSQUE_IMAGES[Math.floor(Math.random() * MOSQUE_IMAGES.length)];
}
