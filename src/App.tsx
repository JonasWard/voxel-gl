import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { useState, useEffect, useCallback } from 'react';

function App() {
  // Helper function to get URL parameters
  const getUrlParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      gridSize: Number(params.get('gridSize')) || 20,
      scale: Number(params.get('scale')) || 0.13,
      thickness: Number(params.get('thickness')) || 0.1,
      enabledTetrahedrons: (params
        .get('tetrahedrons')
        ?.split(',')
        .map((t) => t === 'true') as [boolean, boolean, boolean, boolean, boolean]) || [true, true, true, true, true],
      mirrorOnUneven: params.get('mirror') !== 'false',
      showConfig: params.get('showConfig') !== 'false'
    };
  }, []);

  // Initialize state from URL
  const [state, setState] = useState(getUrlParams);

  // Update URL when state changes
  const updateUrl = useCallback((newState: typeof state) => {
    const params = new URLSearchParams();
    params.set('gridSize', newState.gridSize.toString());
    params.set('scale', newState.scale.toString());
    params.set('thickness', newState.thickness.toString());
    params.set('tetrahedrons', newState.enabledTetrahedrons.join(','));
    params.set('mirror', newState.mirrorOnUneven.toString());
    params.set('showConfig', newState.showConfig.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Update state and URL
  const updateState = useCallback(
    (updates: Partial<typeof state>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        updateUrl(newState);
        return newState;
      });
    },
    [updateUrl]
  );

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setState(getUrlParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getUrlParams]);

  // Destructure state for easier access
  const { gridSize, scale, thickness, enabledTetrahedrons, mirrorOnUneven, showConfig } = state;

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

      {/* Toggle Button */}
      <button
        onClick={() => updateState({ showConfig: !showConfig })}
        className={`absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-lg p-3 text-white shadow-lg border border-gray-700/50 hover:bg-gray-800/90 transition-colors z-30 ${
          showConfig ? 'max-[600px]:hidden' : ''
        }`}
        title={showConfig ? 'Hide Controls' : 'Show Controls'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showConfig ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
          )}
        </svg>
      </button>

      {/* Desktop Sidebar - Large Screens */}
      <div
        className={`hidden min-[600px]:block absolute top-16 left-4 bg-gray-900/90 backdrop-blur-md rounded-xl p-6 text-white shadow-2xl border border-gray-700/50 transition-all duration-300 ease-in-out ${
          showConfig
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-full pointer-events-none'
        }`}
      >
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
              onChange={(e) => updateState({ gridSize: Number(e.target.value) })}
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
              onChange={(e) => updateState({ scale: Number(e.target.value) })}
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
              onChange={(e) => updateState({ thickness: Number(e.target.value) })}
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
                onChange={(e) => updateState({ mirrorOnUneven: e.target.checked })}
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
                      updateState({ enabledTetrahedrons: newEnabled });
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

      {/* Mobile Modal - Small Screens */}
      <div
        className={`min-[600px]:hidden fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out z-20 ${
          showConfig ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => updateState({ showConfig: false })}
      >
        {/* Control Panel */}
        <div
          className={`absolute inset-4 bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-gray-700/50 transition-all duration-300 ease-in-out overflow-y-auto ${
            showConfig ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-100">Controls</h3>
            <button
              onClick={() => updateState({ showConfig: false })}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-200">
                Grid Size: <span className="text-blue-400 font-mono">{gridSize}</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={gridSize}
                onChange={(e) => updateState({ gridSize: Number(e.target.value) })}
                className="w-full h-3 bg-gray-600 rounded-full appearance-none cursor-pointer 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:hover:bg-blue-50 [&::-webkit-slider-thumb]:transition-colors
                           [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full 
                           [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 
                           [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-200">
                Scale: <span className="text-green-400 font-mono">{scale.toFixed(3)}</span>
              </label>
              <input
                type="range"
                min="0.01"
                max=".5"
                step="0.001"
                value={scale}
                onChange={(e) => updateState({ scale: Number(e.target.value) })}
                className="w-full h-3 bg-gray-600 rounded-full appearance-none cursor-pointer 
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:hover:bg-green-50 [&::-webkit-slider-thumb]:transition-colors
                           [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full 
                           [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 
                           [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-200">
                Thickness: <span className="text-purple-400 font-mono">{thickness.toFixed(3)}</span>
              </label>
              <input
                type="range"
                min="0.01"
                max="1.0"
                step="0.001"
                value={thickness}
                onChange={(e) => updateState({ thickness: Number(e.target.value) })}
                className="w-full h-3 bg-gray-600 rounded-full appearance-none cursor-pointer 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:hover:bg-purple-50 [&::-webkit-slider-thumb]:transition-colors
                           [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full 
                           [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-500 
                           [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
              />
            </div>

            {/* Mirror Switch */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mirrorOnUneven}
                  onChange={(e) => updateState({ mirrorOnUneven: e.target.checked })}
                  className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded 
                             focus:ring-orange-500 focus:ring-2 focus:ring-opacity-50"
                />
                <span className="text-lg font-semibold text-gray-200">Mirror on Uneven Indexes</span>
              </label>
            </div>

            {/* Tetrahedron Selection */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <h4 className="text-lg font-bold text-gray-200">Tetrahedrons</h4>
              <div className="grid grid-cols-2 gap-3">
                {enabledTetrahedrons.map((enabled, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => {
                        const newEnabled = [...enabledTetrahedrons] as [boolean, boolean, boolean, boolean, boolean];
                        newEnabled[index] = e.target.checked;
                        updateState({ enabledTetrahedrons: newEnabled });
                      }}
                      className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded 
                                 focus:ring-cyan-500 focus:ring-2 focus:ring-opacity-50"
                    />
                    <span className="text-base font-medium text-gray-300">T{index}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
