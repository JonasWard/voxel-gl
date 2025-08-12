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

export const bases: THREE.Matrix4[] = [
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(-0.5, -0.5, -0.5),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  ),
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(0.5, 0.5, -0.5),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1)
  ),
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(0.5, -0.5, 0.5),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0)
  ),
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(-0.5, 0.5, 0.5),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, -1, 0)
  ),
  getTransformationMatrixFromBaseVectorsAndOrigin(
    new THREE.Vector3(0.5, 0.5, 0.5),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(0, -1, -1),
    new THREE.Vector3(-1, -1, 0)
  )
];

export const baseBuffer = new THREE.BufferGeometry();
baseBuffer.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], 3));
baseBuffer.setIndex([0, 2, 1, 0, 1, 3, 0, 3, 2, 1, 2, 3]);
baseBuffer.computeVertexNormals();
