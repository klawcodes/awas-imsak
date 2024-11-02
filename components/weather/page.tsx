'use client'

import React, { useEffect, useState } from 'react';

interface WeatherData {
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
  };
}

interface GeoLocation {
  results: Array<{
    formatted: string;
    components: {
      city?: string;
      state?: string;
      country?: string;
    };
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
}

interface Location {
  // Tambahkan properti yang sesuai dengan tipe Location Anda
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const detectAndSetLocation = async (locations: Location[]) => {
    console.log('Memulai deteksi lokasi...');
    
    if (!("geolocation" in navigator)) {
      setError('Geolocation tidak didukung oleh browser ini');
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        console.log('Meminta izin lokasi...');
        
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Lokasi berhasil didapatkan');
            resolve(pos);
          },
          (error: GeolocationPositionError) => {
            console.log('Error saat mendapatkan lokasi:', error);
            let errorMessage = "Gagal mendeteksi lokasi: ";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += "Izin lokasi ditolak. Mohon aktifkan izin lokasi di pengaturan browser Anda.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += "Informasi lokasi tidak tersedia. Pastikan GPS/lokasi perangkat Anda aktif.";
                break;
              case error.TIMEOUT:
                errorMessage += "Waktu permintaan lokasi habis. Silakan coba lagi.";
                break;
              default:
                errorMessage += error.message || "Terjadi kesalahan yang tidak diketahui.";
            }
            reject(new Error(errorMessage));
          },
          options
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Koordinat:', latitude, longitude);

      console.log('Mengambil data lokasi dari OpenCage...');
      const locationResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&language=id`
      );
      
      if (!locationResponse.ok) {
        throw new Error('Gagal mengambil data lokasi dari OpenCage');
      }
      
      const locationData: GeoLocation = await locationResponse.json();
      console.log('Data lokasi:', locationData);
      setLocationData(locationData);

      console.log('Mengambil data cuaca...');
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Gagal mengambil data cuaca');
      }
      
      const weatherData: WeatherData = await weatherResponse.json();
      console.log('Data cuaca:', weatherData);
      setWeatherData(weatherData);

    } catch (err) {
      console.error('Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    detectAndSetLocation([]);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-blue-700">Mendeteksi lokasi dan memuat data cuaca...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => {
              setError('');
              setLoading(true);
              detectAndSetLocation([]);
            }}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {weatherData && locationData && locationData.results.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Informasi Cuaca</h2>
            <p className="text-gray-600">
              Lokasi: {locationData.results[0].formatted}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">{weatherData.main.temp.toFixed(1)}°C</p>
              <p className="text-xl">{weatherData.weather[0].main}</p>
              <p className="text-gray-600">{weatherData.weather[0].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;