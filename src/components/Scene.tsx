import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getVertexForMatrix, tetrahedronGeometries as tGs } from './tetrahedrons';

const MR = new THREE.Matrix4().makeRotationX(Math.PI / 2);

const ps = tGs.map(([, p]) => p);
const p90s = ps.map((p) => getVertexForMatrix(p, MR));

const gridCount = 50;
const M0 = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const scale = 0.13;
const thickness = 0.3;

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

const InstancedCubes: React.FC<{ tetrahedronIndex: 0 | 1 | 2 | 3 | 4 }> = ({ tetrahedronIndex }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return;

    const matrices: THREE.Matrix4[] = [];
    const xyz: [number, number, number][] = [];
    const colors: THREE.Color[] = [];

    let i = 0;

    for (let x = 0; x < gridCount; x++) {
      for (let y = 0; y < gridCount; y++) {
        for (let z = 0; z < gridCount; z++) {
          const M = new THREE.Matrix4();
          xyz.push([x, y, z]);
          M.setPosition(x, y, z);
          if (i % 2) M.multiply(MR);
          matrices.push(M);
          // Create a gradient color based on position
          colors.push(
            new THREE.Color().setHSL(
              ((x +
                (i % 2 ? ps : p90s)[tetrahedronIndex][0] +
                (y + (i % 2 ? ps : p90s)[tetrahedronIndex][1]) +
                (z + (i % 2 ? ps : p90s)[tetrahedronIndex][2])) /
                gridCount) *
                5,
              1.0,
              0.8
            )
          );
        }
        i++;
      }
    }

    matrices.forEach((M, i) => {
      const [x, y, z] = xyz[i];
      const g = gyroidSDF(
        x + (i % 2 ? ps : p90s)[tetrahedronIndex][0],
        y + (i % 2 ? ps : p90s)[tetrahedronIndex][1],
        z + (i % 2 ? ps : p90s)[tetrahedronIndex][2],
        scale,
        thickness
      );
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, gridCount ** 3]} geometry={tGs[tetrahedronIndex][0]}>
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.6} />
      <InstancedCubes tetrahedronIndex={0} />
      <InstancedCubes tetrahedronIndex={1} />
      <InstancedCubes tetrahedronIndex={2} />
      <InstancedCubes tetrahedronIndex={3} />
      <InstancedCubes tetrahedronIndex={4} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={0.1} maxDistance={1000} />
    </>
  );
};
