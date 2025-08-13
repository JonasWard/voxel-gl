import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { baseBuffer, bases } from './tetrahedrons';
import { cubeBuffer, cubeBases } from './cubes';
import { surfaceSDF, type SurfaceType } from './surfaces';
import type { GeometryType } from '../App';

const MR = new THREE.Matrix4().makeRotationX(Math.PI / 2);
const M0 = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

interface SceneProps {
  gridSize: number;
  scale: number;
  thickness: number;
  enabledTetrahedrons: [boolean, boolean, boolean, boolean, boolean];
  mirrorOnUneven: boolean;
  surfaceType: SurfaceType;
  geometryType: GeometryType;
}

type TetrahedronIndexType = 0 | 1 | 2 | 3 | 4;
const baseVector = new THREE.Vector4(0.384, 0.384, 0.384, 1);

const InstancedGeometry: React.FC<{
  tetrahedronIndex: TetrahedronIndexType;
  gridSize: number;
  scale: number;
  thickness: number;
  mirrorOnUneven: boolean;
  surfaceType: SurfaceType;
  geometryType: GeometryType;
}> = ({ tetrahedronIndex, gridSize, scale, thickness, mirrorOnUneven, surfaceType, geometryType }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return;

    // Choose the appropriate bases and geometry based on geometry type
    const currentBases = geometryType === 'cube' ? cubeBases : bases;
    const baseIndex = geometryType === 'cube' ? 0 : tetrahedronIndex;

    // For cubes, we only have one base, so use index 0
    const baseM = currentBases[Math.min(baseIndex, currentBases.length - 1)];
    const baseMR = mirrorOnUneven ? MR.clone().multiply(baseM) : baseM;

    const v = [baseM.elements[12], baseM.elements[13], baseM.elements[14]].map((n) => n - gridSize * 0.5);
    const vR = [baseMR.elements[12], baseMR.elements[13], baseMR.elements[14]].map((n) => n - gridSize * 0.5);

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
  }, [gridSize, scale, thickness, mirrorOnUneven, surfaceType, geometryType, tetrahedronIndex]);

  // Choose the appropriate geometry based on geometry type
  const currentGeometry = geometryType === 'cube' ? cubeBuffer : baseBuffer;

  return (
    <instancedMesh
      frustumCulled={false}
      ref={meshRef}
      args={[undefined, undefined, gridSize ** 3]}
      geometry={currentGeometry}
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
  surfaceType,
  geometryType
}) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, -10, -10]} intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={-0.15} />
      {geometryType === 'cube' ? (
        // For cubes, we only need one instance since we only have one base
        <InstancedGeometry
          key={0}
          tetrahedronIndex={0 as TetrahedronIndexType}
          gridSize={gridSize}
          scale={scale}
          thickness={thickness}
          mirrorOnUneven={mirrorOnUneven}
          surfaceType={surfaceType}
          geometryType={geometryType}
        />
      ) : (
        // For tetrahedrons, use the enabled tetrahedrons array
        enabledTetrahedrons.map((b, index) =>
          b ? (
            <InstancedGeometry
              key={index}
              tetrahedronIndex={index as TetrahedronIndexType}
              gridSize={gridSize}
              scale={scale}
              thickness={thickness}
              mirrorOnUneven={mirrorOnUneven}
              surfaceType={surfaceType}
              geometryType={geometryType}
            />
          ) : null
        )
      )}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={0.1} maxDistance={1000} />
    </>
  );
};
