import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Scene } from './components/Scene';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <div className="flex gap-8 mb-4">
          <a href="https://vite.dev" target="_blank" className="hover:opacity-80 transition-opacity">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
            <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
          </a>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Vite + React + Three.js + Tailwind</h1>
      </div>

      {/* 3D Scene */}
      <div className="h-96 mx-4 mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <Canvas camera={{ position: [3, 3, 3] }}>
          <Scene />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-600 text-center">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
