import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { useState } from 'react';

function App() {
  const [gridSize, setGridSize] = useState(20);
  const [scale, setScale] = useState(0.13);
  const [thickness, setThickness] = useState(0.1);
  const [enabledTetrahedrons, setEnabledTetrahedrons] = useState<[boolean, boolean, boolean, boolean, boolean]>([
    true,
    true,
    true,
    true,
    true
  ]);
  const [mirrorOnUneven, setMirrorOnUneven] = useState(true);

  return (
    <div className="w-[100svw] h-[100svh] relative">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <Scene
          gridSize={gridSize}
          scale={scale}
          thickness={thickness}
          enabledTetrahedrons={enabledTetrahedrons}
          mirrorOnUneven={mirrorOnUneven}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-xl p-6 text-white shadow-2xl border border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-gray-100">Controls</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Grid Size: <span className="text-blue-400 font-mono">{gridSize}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                         [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 
                         [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:hover:bg-blue-50 [&::-webkit-slider-thumb]:transition-colors
                         [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                         [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 
                         [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Scale: <span className="text-green-400 font-mono">{scale.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max=".5"
              step="0.001"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer 
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                         [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 
                         [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:hover:bg-green-50 [&::-webkit-slider-thumb]:transition-colors
                         [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                         [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 
                         [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Thickness: <span className="text-purple-400 font-mono">{thickness.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.001"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                         [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 
                         [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:hover:bg-purple-50 [&::-webkit-slider-thumb]:transition-colors
                         [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                         [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-500 
                         [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          {/* Mirror Switch */}
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mirrorOnUneven}
                onChange={(e) => setMirrorOnUneven(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded 
                           focus:ring-orange-500 focus:ring-2 focus:ring-opacity-50"
              />
              <span className="text-sm font-semibold text-gray-200">Mirror on Uneven Indexes</span>
            </label>
          </div>

          {/* Tetrahedron Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-700">
            <h4 className="text-sm font-bold text-gray-200">Tetrahedrons</h4>
            <div className="grid grid-cols-2 gap-2">
              {enabledTetrahedrons.map((enabled, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => {
                      const newEnabled = [...enabledTetrahedrons] as [boolean, boolean, boolean, boolean, boolean];
                      newEnabled[index] = e.target.checked;
                      setEnabledTetrahedrons(newEnabled);
                    }}
                    className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 rounded 
                               focus:ring-cyan-500 focus:ring-1 focus:ring-opacity-50"
                  />
                  <span className="text-xs font-medium text-gray-300">T{index}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
