import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const AudioButtonAyahs: React.FC<{ audioSource: string }> = ({ audioSource }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleAudioEnded = () => {
    setIsPlaying(false); // Set isPlaying to false when audio ends
  };

  return (
    <>
      <audio ref={audioRef} src={audioSource} onEnded={handleAudioEnded} />
      <div className='flex justify-end mt-2'>
      <button className='px-4 py-2 bg-[#0d1811] border border-[#3e664e] rounded-full' onClick={togglePlay}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      </div>
    </>
  );
};

export default AudioButtonAyahs;
