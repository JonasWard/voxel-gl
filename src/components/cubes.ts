import * as THREE from 'three';

const getTransformationMatrixFromBaseVectorsAndOrigin = (
  o: THREE.Vector3,
  x: THREE.Vector3,
  y: THREE.Vector3,
  z: THREE.Vector3
) => {
  const M = new THREE.Matrix4();
  M.set(x.x, y.x, z.x, o.x, x.y, y.y, z.y, o.y, x.z, y.z, z.z, o.z, 0, 0, 0, 1);

  return M;
};

// Simple cube bases - just one transformation matrix for a unit cube
export const cubeBases: THREE.Matrix4[] = [
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  )
];

// Create a simple cube geometry
export const cubeBuffer = new THREE.BoxGeometry(1, 1, 1);
