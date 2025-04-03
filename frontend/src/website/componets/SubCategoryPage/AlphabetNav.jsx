import React from "react";
import { useNavigate } from "react-router-dom";

export default function AlphabetNav({ chemicals }) {  // Accept chemicals as prop
  const navigate = useNavigate();
  const letters = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const handleNavigate = (letter) => {
    // Navigate to the desired route and pass chemicals and the selected letter as state
    navigate(`/products/code=${letter === '0-9' ? 'num' : letter}`, {
      state: { selectedLetter: letter, chemicals },  // Pass both selectedLetter and chemicals
    });
  };

  return (
    <div className="flex flex-wrap gap-0 border bg-gray-100">
      {letters.map((letter, index) => (
        <button
          key={letter}
          onClick={() => handleNavigate(letter)}  // Trigger navigate on click
          className={`w-[44px] h-8 flex text-sm border-t border-b 
            ${index !== letters.length - 1 ? 'border-r' : ''} 
            font-semibold items-center justify-center hover:bg-blue-100 text-blue-600 
            sm:w-[60px] sm:h-10 sm:text-base md:w-[46px] md:h-12 md:text-lg`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
