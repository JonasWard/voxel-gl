import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const gridCount = 100;

const InstancedCubes = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tempObject = new THREE.Object3D();

  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return;

    const positions: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];

    for (let x = 0; x < gridCount; x++) {
      for (let y = 0; y < gridCount; y++) {
        for (let z = 0; z < gridCount; z++) {
          positions.push(new THREE.Vector3(x - 4.5, y - 4.5, z - 4.5));
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

    positions.forEach((position, i) => {
      tempObject.position.copy(position);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      meshRef.current.setColorAt(i, colors[i]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [meshRef.current]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Rotate the entire grid slowly
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x += delta * 0.05;
  });

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
