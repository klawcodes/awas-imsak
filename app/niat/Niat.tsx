import Link from 'next/link'

const Niat = () => {
  return (
    <div className='bodi-niat mt-[3rem]'>
      <div className="flex flex-col justify-center items-center max-[414px]:mt-[5rem]">
        <div className="flex flex-col items-center mb-3">
          <Link href="/" className="flex justify-start w-full">
            <div>
              <p className="bg-[#0d1811] border border-[#3e664e] hover:bg-[#1e3828] text-white py-1 px-3 rounded-full max-[414px]:text-[12px] max-[640px]:text-[13px]">
                ⬅ Back to Home
              </p>
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
        max-[640px]:text-[2rem]
        text-transparent 
        bg-clip-text
        drop-shadow-xl
      "
          >
            Awas Lupa Niat
          </p>
          <p>Awas kawan jangan sampai lupa!</p>
        </div>
        <div className="flex flex-col space-y-5 mb-5 w-[50%] max-[414px]:w-[75%] max-[640px]:w-[75%]">
          <div className="bg-[#0d1811] border border-[#3e664e] p-5 rounded-2xl">
            <p className="justify-center text-center mb-5 text-xl max-[414px]:text-[15px]">
              Niat Puasa Ramadhan untuk Sehari:
            </p>
            <p className="text-2xl justify-end text-end mb-2 max-[414px]:text-[20px]">
              نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ
              السَّنَةِ لِلّٰهِ تَعَالَى
            </p>
            <p className="font-bold mb-2 max-[414px]:text-[12px]">
              Nawaitu shauma ghadin &apos;an ada&apos;i fardhi syahri Ramadhana
              hadzihis sanati lillahi ta&apos;ala.
            </p>
            <p className='max-[414px]:text-[12px]'>
              Artinya: “Aku niat berpuasa esok hari untuk menunaikan kewajiban
              puasa bulan Ramadhan tahun ini, karena Allah Ta&apos;ala.”
            </p>
          </div>
          <div className="bg-[#0d1811] border border-[#3e664e] p-5 rounded-2xl">
            <p className="justify-center text-center mb-5 text-xl max-[414px]:text-[15px]">
              Niat Puasa Ramadhan untuk Sebulan Penuh:
            </p>
            <p className="text-2xl justify-end text-end mb-2 max-[414px]:text-[20px]">
              نَوَيْتُ صَوْمَ جَمِيْعِ شَهْرِ رَمَضَانِ هٰذِهِ السَّنَةِ فَرْضًا
              لِلّٰهِ تَعَالَى
            </p>
            <p className="font-bold mb-2 max-[414px]:text-[12px]">
              Nawaitu shauma jami&apos;i syahri Ramadhani hadzihis sanati
              fardhan lillahi ta&apos;ala.
            </p>
            <p className='max-[414px]:text-[12px]'>
              Artinya: “Aku niat berpuasa di sepanjang bulan Ramadhan tahun ini
              dengan mengikuti pendapat Imam Malik, wajib karena Allah
              Ta&apos;ala.”
            </p>
          </div>
        </div>
        <div className="flex justify-between w-[50%] max-[414px]:w-[75%] max-[640px]:w-[75%]">
          <Link href="/tadarus">
            <div className="bg-[#0d1811] border border-[#3e664e] py-3 px-4 hover:border-[#2b4733] transition-colors active-shadow rounded-full max-[640px]:text-[13px] max-[414px]:text-[13px] max-[360px]:text-[10px]">
              Awas Lupa Tadarus
            </div>
          </Link>
          <Link href="/resep">
            <div className="bg-[#0d1811] border border-[#3e664e] py-3 px-4 hover:border-[#2b4733] transition-colors active-shadow rounded-full max-[640px]:text-[13px] max-[414px]:text-[13px] max-[360px]:text-[10px]">
              Awas Lupa Buka
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Niat