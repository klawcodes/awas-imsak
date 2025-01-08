'use client'

import React, { useEffect } from 'react';

interface StarryBackgroundProps {
  numberOfStars?: number;
  children?: React.ReactNode;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ 
  numberOfStars = 100,
  children 
}) => {
  useEffect(() => {
    const createStars = () => {
      const container = document.getElementById('starsContainer');
      if (!container) return;
      
      // Clear existing stars
      container.innerHTML = '';

      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 2 + Math.random() * 3;
        const delay = Math.random() * 3;
        
        star.style.cssText = `
          left: ${left}%;
          top: ${top}%;
          --duration: ${duration}s;
          --delay: ${delay}s;
        `;
        
        container.appendChild(star);
      }
    };

    createStars();

    // Cleanup function
    return () => {
      const container = document.getElementById('starsContainer');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [numberOfStars]);

  return (
    <div className="bodi">
      <div id="starsContainer" className="stars" />
      {children}
    </div>
  );
};

export default StarryBackground;