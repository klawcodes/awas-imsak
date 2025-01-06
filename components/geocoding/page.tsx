async function getGeocodingData(lat: number, lng: number) {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat} ${lng}&key=${apiKey}&language=id`,
      { cache: 'no-store' } // atau 'force-cache' jika ingin di-cache
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch geocoding data');
    }
    
    return response.json();
  }
  
  export default async function Geocoding({ 
    lat, 
    lng 
  }: { 
    lat: number; 
    lng: number;
  }) {
    const data = await getGeocodingData(lat, lng);
    
    return (
      <div>
        {/* Tampilkan data yang sudah di fetch */}
        <pre>{JSON.stringify(data.results[0].formatted, null, 2)}</pre>
      </div>
    );
  }