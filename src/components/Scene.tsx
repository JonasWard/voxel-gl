import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { baseBuffer, bases } from './tetrahedrons';

const MR = new THREE.Matrix4().makeRotationX(Math.PI / 2);

const gridCount = 100;
const M0 = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const scale = 0.13;
const thickness = 0.5;

const baseVector = new THREE.Vector4(0.43, 0.43, 0.43, 1);

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
    const xyz: THREE.Vector4[] = [];
    const colors: THREE.Color[] = [];

    const baseM = bases[tetrahedronIndex];
    const baseMR = MR.clone().multiply(baseM);

    const v = [baseM.elements[12], baseM.elements[13], baseM.elements[14]];
    const vR = [baseMR.elements[12], baseMR.elements[13], baseMR.elements[14]];

    let i = 0;

    for (let x = 0; x < gridCount; x++) {
      for (let y = 0; y < gridCount; y++) {
        for (let z = 0; z < gridCount; z++) {
          i = x + y + z;
          const M = (i % 2 ? baseM : baseMR).clone();
          i % 2 ? M.setPosition(x + v[0], y + v[1], z + v[2]) : M.setPosition(x + vR[0], y + vR[1], z + vR[2]);
          matrices.push(M);

          const c = baseVector.clone().applyMatrix4(M);
          xyz.push(c);
          // Create a gradient color based on position
          colors.push(new THREE.Color().setHSL(((c.x + c.y + c.z) / gridCount) * 5, 1.0, 0.5));
        }
      }
    }

    matrices.forEach((M, i) => {
      const { x, y, z } = xyz[i];
      const g = gyroidSDF(x, y, z, scale, thickness);
      if (g < 0) meshRef.current.setMatrixAt(i, M);
      else meshRef.current.setMatrixAt(i, M0);

      meshRef.current.setColorAt(i, colors[i]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [meshRef.current]);

  return (
    <instancedMesh
      frustumCulled={false}
      ref={meshRef}
      args={[undefined, undefined, gridCount ** 3]}
      geometry={baseBuffer}
    >
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} />
      <directionalLight position={[10, 10, 10]} intensity={2.0} />
      <InstancedCubes tetrahedronIndex={0} />
      <InstancedCubes tetrahedronIndex={1} />
      <InstancedCubes tetrahedronIndex={2} />
      <InstancedCubes tetrahedronIndex={3} />
      <InstancedCubes tetrahedronIndex={4} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={0.1} maxDistance={1000} />
    </>
  );
};
