import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

interface AudioButtonProps {
  audioSource: string;
  description: string;
}

const AudioButtonWithSlider: React.FC<AudioButtonProps> = ({ audioSource, description }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseInt(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleAudioEnded = () => {
    if (audioRef.current) {
      setIsPlaying(false);
      setCurrentTime(0);
      audioRef.current.currentTime = 0;
    }
  };
  

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSource}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />
      <div>{description}</div>
      <div className="flex w-full justify-center items-center">
        <div className="flex w-[25rem] max-[640px]:w-[18rem] max-[414px]:w-[20rem] justify-center items-center space-x-5 bg-[#0d1811] border border-[#3e664e] rounded-full p-2 active-shadow">
          <button onClick={togglePlay}>
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            style={{ backgroundColor: "#3e664e" }}
          />
          <div className='max-[414px]:text-[11px]'>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioButtonWithSlider;
