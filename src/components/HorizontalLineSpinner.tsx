import React, { useState, useEffect } from 'react';
import './HorizontalLineSpinner.scss';

const HorizontalLineSpinner: React.FC = () => {
 const [currentLine, setCurrentLine] = useState(0);

 useEffect(() => {
  const interval = setInterval(() => {
   setCurrentLine((currentLine + 1) % 7);
  }, 750);

  return () => clearInterval(interval);
 }, [currentLine]);

 const lines = [
  { x1: 5, x2: 31 },
  { x1: 31, x2: 62 },
  { x1: 62, x2: 93 },
  { x1: 93, x2: 124 },
  { x1: 124, x2: 155 },
  { x1: 155, x2: 186 },
  { x1: 186, x2: 217 },
 ];

 return (
  <div className="horizontal-line-spinner-container">
   <img style={{ width: '266px', height: '81px' }} src="assets/images/the-nobo-logo.png" />
   <svg width="222" height="10" viewBox="0 0 222 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    {lines.map((line, index) => (
     <line
      key={index}
      x1={line.x1}
      y1="5"
      x2={line.x2}
      y2="5"
      stroke="#D6980E"
      strokeWidth={index === currentLine ? 10 : 6}
      strokeLinecap="round"
      strokeDasharray={index === currentLine ? '100 0' : '0 100'}
      style={{ transition: 'all 0.3s ease-in-out' }}
     />
    ))}
   </svg>
  </div>
 );
};

export default HorizontalLineSpinner;
