import React, { useState, useRef } from 'react';
import { DollarSign } from 'lucide-react';

// Define image URLs
const titleImageUrl = "https://i.imgur.com/QpUQDRF.png"; // Title with neon effect
const wheelImageUrl = "https://i.imgur.com/QpUQDRF.png"; // Wheel with transparent background
const pointerImageUrl = "https://i.imgur.com/vxLcKGa.png"; // Pointer (bottle) with transparent background

// Define the possible outcomes and their probabilities
const WHEEL_SEGMENTS = [
  { id: 1, name: "Face 1", multiplier: 2 },
  { id: 2, name: "Face 2", multiplier: 1.5 },
  { id: 3, name: "Face 3", multiplier: 3 },
  { id: 4, name: "Face 4", multiplier: 2.5 },
  { id: 5, name: "Face 5", multiplier: 1.8 },
  { id: 6, name: "Center Face", multiplier: 5 },
];

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [bet, setBet] = useState(1);
  const [balance, setBalance] = useState(100);
  const [result, setResult] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning || bet > balance) return;
    
    setIsSpinning(true);
    setResult(null);
    setBalance(prev => prev - bet);

    // Random number of full rotations (3-5) plus random segment
    const spinDegrees = 360 * (Math.floor(Math.random() * 3) + 3);
    const extraDegrees = Math.random() * 360;
    const totalRotation = spinDegrees + extraDegrees;
    
    setRotation(prev => prev + totalRotation);

    // Calculate result after spin
    setTimeout(() => {
      const segment = Math.floor((totalRotation % 360) / (360 / WHEEL_SEGMENTS.length));
      const winnings = bet * WHEEL_SEGMENTS[segment].multiplier;
      setBalance(prev => prev + winnings);
      setResult(`Won $${winnings.toFixed(2)}!`);
      setIsSpinning(false);
    }, 8000);
  };

  const handleBetChange = (increment: number) => {
    const newBet = Math.min(Math.max(bet + increment, 1), 100);
    setBet(newBet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Title Image */}
        <div className="mb-8">
          <img 
            src={titleImageUrl} 
            alt="Roztoč a vyhraj"
            className="h-24 mx-auto object-contain"
          />
        </div>
        
        <div className="relative w-96 h-96 mx-auto mb-8">
          {/* Wheel */}
          <img
            ref={wheelRef}
            src={wheelImageUrl}
            alt="Prize Wheel"
            className="absolute w-full h-full transition-transform duration-[8s] ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              mixBlendMode: 'multiply' // This helps with transparency
            }}
          />
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-24 z-10">
            <img 
              src={pointerImageUrl} 
              alt="pointer"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply' }} // This helps with transparency
            />
          </div>
        </div>

        {/* Betting Controls */}
        <div className="bg-purple-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => handleBetChange(-1)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              disabled={bet <= 1}
            >
              -
            </button>
            <div className="text-2xl font-bold">
              <DollarSign className="inline" size={24} />
              {bet}
            </div>
            <button 
              onClick={() => handleBetChange(1)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              disabled={bet >= 100}
            >
              +
            </button>
          </div>

          <div className="text-xl mb-4">
            Balance: <DollarSign className="inline" size={20} />{balance}
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || bet > balance}
            className={`w-full py-3 rounded-lg text-xl font-bold transition
              ${isSpinning || bet > balance 
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
              }`}
          >
            {isSpinning ? 'Spinning...' : 'SPIN!'}
          </button>

          {result && (
            <div className="mt-4 text-2xl font-bold text-green-400">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;