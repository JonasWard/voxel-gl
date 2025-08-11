import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const gridCount = 100;
const M0 = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

// Gyroid SDF function
const gyroidSDF = (x: number, y: number, z: number, scale: number = 1.0, thickness: number = 0.3) => {
  const sx = x * scale;
  const sy = y * scale;
  const sz = z * scale;

  // Gyroid equation: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x)
  const gyroid = Math.sin(sx) * Math.cos(sy) + Math.sin(sy) * Math.cos(sz) + Math.sin(sz) * Math.cos(sx);

  // Return distance to surface (negative inside, positive outside)
  return Math.abs(gyroid) - thickness;
};

const InstancedCubes = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return;

    const matrices: THREE.Matrix4[] = [];
    const xyz: [number, number, number][] = [];
    const colors: THREE.Color[] = [];

    for (let x = 0; x < gridCount; x++) {
      for (let y = 0; y < gridCount; y++) {
        for (let z = 0; z < gridCount; z++) {
          const M = new THREE.Matrix4();
          xyz.push([x, y, z]);
          M.setPosition(x - 4.5, y - 4.5, z - 4.5);
          matrices.push(M);
          // Create a gradient color based on position
          colors.push(
            new THREE.Color().setHSL(
              (x + y + z) / 30, // hue
              0.7, // saturation
              0.6 // lightness
            )
          );
        }
      }
    }

    matrices.forEach((M, i) => {
      const [x, y, z] = xyz[i];
      const g = gyroidSDF(x, y, z, 0.1, 0.1);
      if (g < 0) meshRef.current.setMatrixAt(i, M);
      else meshRef.current.setMatrixAt(i, M0);

      meshRef.current.setColorAt(i, colors[i]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [meshRef.current]);

  // useFrame((_, delta) => {
  //   if (!meshRef.current) return;

  //   // Rotate the entire grid slowly
  //   meshRef.current.rotation.y += delta * 0.1;
  //   meshRef.current.rotation.x += delta * 0.05;
  // });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, gridCount ** 3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.6} />
      <InstancedCubes />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={0.1} maxDistance={1000} />
    </>
  );
};
