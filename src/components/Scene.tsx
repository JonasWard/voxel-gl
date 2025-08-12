import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { baseBuffer, bases } from './tetrahedrons';
import { surfaceSDF, type SurfaceType } from './surfaces';

const MR = new THREE.Matrix4().makeRotationX(Math.PI / 2);
const M0 = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

interface SceneProps {
  gridSize: number;
  scale: number;
  thickness: number;
  enabledTetrahedrons: [boolean, boolean, boolean, boolean, boolean];
  mirrorOnUneven: boolean;
  surfaceType: SurfaceType;
}

type TetrahedronIndexType = 0 | 1 | 2 | 3 | 4;
const baseVector = new THREE.Vector4(0.384, 0.384, 0.384, 1);

const InstancedCubes: React.FC<{
  tetrahedronIndex: TetrahedronIndexType;
  gridSize: number;
  scale: number;
  thickness: number;
  mirrorOnUneven: boolean;
  surfaceType: SurfaceType;
}> = ({ tetrahedronIndex, gridSize, scale, thickness, mirrorOnUneven, surfaceType }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return;

    const baseM = bases[tetrahedronIndex];
    const baseMR = mirrorOnUneven ? MR.clone().multiply(baseM) : baseM;

    const v = [baseM.elements[12], baseM.elements[13], baseM.elements[14]];
    const vR = [baseMR.elements[12], baseMR.elements[13], baseMR.elements[14]];

    let i = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const index = x + y + z;
          const M = (index % 2 ? baseMR : baseM).clone();
          index % 2 ? M.setPosition(x + vR[0], y + vR[1], z + vR[2]) : M.setPosition(x + v[0], y + v[1], z + v[2]);

          const c = baseVector.clone().applyMatrix4(M);
          // Create a gradient color based on position
          const g = surfaceSDF(surfaceType, c.x, c.y, c.z, scale, thickness);
          if (g < 0) meshRef.current.setMatrixAt(i, M);
          else meshRef.current.setMatrixAt(i, M0);
          meshRef.current.setColorAt(i, new THREE.Color().setHSL(((c.x + c.y + c.z) / gridSize) * 5, 1.0, 0.5));
          i++;
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [gridSize, scale, thickness, mirrorOnUneven, surfaceType]);

  return (
    <instancedMesh
      frustumCulled={false}
      ref={meshRef}
      args={[undefined, undefined, gridSize ** 3]}
      geometry={baseBuffer}
    >
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export const Scene: React.FC<SceneProps> = ({
  gridSize,
  scale,
  thickness,
  enabledTetrahedrons,
  mirrorOnUneven,
  surfaceType
}) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, -10, -10]} intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={-0.15} />
      {enabledTetrahedrons.map((b, index) =>
        b ? (
          <InstancedCubes
            key={index}
            tetrahedronIndex={index as TetrahedronIndexType}
            gridSize={gridSize}
            scale={scale}
            thickness={thickness}
            mirrorOnUneven={mirrorOnUneven}
            surfaceType={surfaceType}
          />
        ) : null
      )}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={0.1} maxDistance={1000} />
    </>
  );
};
