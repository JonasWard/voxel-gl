import type { GeometryType } from '../App';

interface GeometrySelectorProps {
  geometryType: GeometryType;
  onGeometryChange: (geometry: GeometryType) => void;
  enabledTetrahedrons: [boolean, boolean, boolean, boolean, boolean];
  onTetrahedronsChange: (tetrahedrons: [boolean, boolean, boolean, boolean, boolean]) => void;
  isMobile?: boolean;
}

export const GeometrySelector: React.FC<GeometrySelectorProps> = ({
  geometryType,
  onGeometryChange,
  enabledTetrahedrons,
  onTetrahedronsChange,
  isMobile = false
}) => {
  const radioSize = isMobile ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = isMobile ? 'text-base' : 'text-sm';
  const checkboxSize = isMobile ? 'w-4 h-4' : 'w-3 h-3';
  const checkboxTextSize = isMobile ? 'text-base' : 'text-xs';
  const spacing = isMobile ? 'space-x-6' : 'space-x-4';
  const labelSpacing = isMobile ? 'space-x-3' : 'space-x-2';
  const gridCols = isMobile ? 'grid-cols-2' : 'grid-cols-2';
  const gridGap = isMobile ? 'gap-3' : 'gap-2';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={`block ${textSize} font-semibold text-gray-200`}>Geometry Type</label>
        <div className={`flex ${spacing}`}>
          <label className={`flex items-center ${labelSpacing} cursor-pointer`}>
            <input
              type="radio"
              name={isMobile ? 'geometry-mobile' : 'geometry'}
              value="tetrahedron"
              checked={geometryType === 'tetrahedron'}
              onChange={(e) => onGeometryChange(e.target.value as GeometryType)}
              className={`${radioSize} text-yellow-500 bg-gray-700 border-gray-600 
                         focus:ring-yellow-500 focus:ring-2 focus:ring-opacity-50`}
            />
            <span className={`${textSize} font-medium text-gray-300`}>Tetrahedron</span>
          </label>
          <label className={`flex items-center ${labelSpacing} cursor-pointer`}>
            <input
              type="radio"
              name={isMobile ? 'geometry-mobile' : 'geometry'}
              value="cube"
              checked={geometryType === 'cube'}
              onChange={(e) => onGeometryChange(e.target.value as GeometryType)}
              className={`${radioSize} text-yellow-500 bg-gray-700 border-gray-600 
                         focus:ring-yellow-500 focus:ring-2 focus:ring-opacity-50`}
            />
            <span className={`${textSize} font-medium text-gray-300`}>Cube</span>
          </label>
        </div>
      </div>

      {/* Tetrahedron Selection - Only show when tetrahedron is selected */}
      {geometryType === 'tetrahedron' && (
        <div className="space-y-3 pt-2 border-t border-gray-700">
          <h4 className={`${textSize} font-bold text-gray-200`}>Tetrahedrons</h4>
          <div className={`grid ${gridCols} ${gridGap}`}>
            {enabledTetrahedrons.map((enabled, index) => (
              <label key={index} className={`flex items-center ${labelSpacing} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    const newEnabled = [...enabledTetrahedrons] as [boolean, boolean, boolean, boolean, boolean];
                    newEnabled[index] = e.target.checked;
                    onTetrahedronsChange(newEnabled);
                  }}
                  className={`${checkboxSize} text-cyan-500 bg-gray-700 border-gray-600 rounded 
                             focus:ring-cyan-500 focus:ring-1 focus:ring-opacity-50`}
                />
                <span className={`${checkboxTextSize} font-medium text-gray-300`}>T{index}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
