// Minimal surface SDF functions

export type SurfaceType = 'gyroid' | 'neovius' | 'schwarzD' | 'schwarzP';

export const surfaceTypes: { value: SurfaceType; label: string }[] = [
  { value: 'gyroid', label: 'Gyroid' },
  { value: 'neovius', label: 'Neovius' },
  { value: 'schwarzD', label: 'Schwarz D' },
  { value: 'schwarzP', label: 'Schwarz P' }
];

// Gyroid SDF function
export const gyroidSDF = (x: number, y: number, z: number, scale: number = 1.0, thickness: number = 0.3) => {
  const sx = x * scale;
  const sy = y * scale;
  const sz = z * scale;

  // Gyroid equation: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x)
  const gyroid = Math.sin(sx) * Math.cos(sy) + Math.sin(sy) * Math.cos(sz) + Math.sin(sz) * Math.cos(sx);

  // Return distance to surface (negative inside, positive outside)
  return Math.abs(gyroid) - thickness;
};

// Neovius SDF function
export const neoviusSDF = (x: number, y: number, z: number, scale: number = 1.0, thickness: number = 0.3) => {
  const sx = x * scale;
  const sy = y * scale;
  const sz = z * scale;

  // Neovius equation: 3(cos(x) + cos(y) + cos(z)) + 4*cos(x)*cos(y)*cos(z)
  const neovius = 3 * (Math.cos(sx) + Math.cos(sy) + Math.cos(sz)) + 4 * Math.cos(sx) * Math.cos(sy) * Math.cos(sz);

  // Return distance to surface (negative inside, positive outside)
  return Math.abs(neovius) - thickness;
};

// Schwarz D SDF function
export const schwarzDSDF = (x: number, y: number, z: number, scale: number = 1.0, thickness: number = 0.3) => {
  const sx = x * scale;
  const sy = y * scale;
  const sz = z * scale;

  // Schwarz D equation: sin(x)*sin(y)*sin(z) + sin(x)*cos(y)*cos(z) + cos(x)*sin(y)*cos(z) + cos(x)*cos(y)*sin(z)
  const schwarzD =
    Math.sin(sx) * Math.sin(sy) * Math.sin(sz) +
    Math.sin(sx) * Math.cos(sy) * Math.cos(sz) +
    Math.cos(sx) * Math.sin(sy) * Math.cos(sz) +
    Math.cos(sx) * Math.cos(sy) * Math.sin(sz);

  // Return distance to surface (negative inside, positive outside)
  return Math.abs(schwarzD) - thickness;
};

// Schwarz P SDF function
export const schwarzPSDF = (x: number, y: number, z: number, scale: number = 1.0, thickness: number = 0.3) => {
  const sx = x * scale;
  const sy = y * scale;
  const sz = z * scale;

  // Schwarz P equation: cos(x) + cos(y) + cos(z)
  const schwarzP = Math.cos(sx) + Math.cos(sy) + Math.cos(sz);

  // Return distance to surface (negative inside, positive outside)
  return Math.abs(schwarzP) - thickness;
};

// Main surface SDF function that dispatches to the correct surface type
export const surfaceSDF = (
  surfaceType: SurfaceType,
  x: number,
  y: number,
  z: number,
  scale: number = 1.0,
  thickness: number = 0.3
) => {
  switch (surfaceType) {
    case 'gyroid':
      return gyroidSDF(x, y, z, scale, thickness);
    case 'neovius':
      return neoviusSDF(x, y, z, scale, thickness);
    case 'schwarzD':
      return schwarzDSDF(x, y, z, scale, thickness);
    case 'schwarzP':
      return schwarzPSDF(x, y, z, scale, thickness);
    default:
      return gyroidSDF(x, y, z, scale, thickness);
  }
};
