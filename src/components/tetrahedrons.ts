import * as THREE from 'three';

const positions = {
  0: [-0.5, -0.5, -0.5],
  1: [0.5, -0.5, -0.5],
  2: [-0.5, 0.5, -0.5],
  3: [0.5, 0.5, -0.5],
  4: [-0.5, -0.5, 0.5],
  5: [0.5, -0.5, 0.5],
  6: [-0.5, 0.5, 0.5],
  7: [0.5, 0.5, 0.5]
} as const;

type FaceTypes = [keyof typeof positions, keyof typeof positions, keyof typeof positions][][];

// Face definitions for the 5 tetrahedrons
const tetrahedrons: [keyof typeof positions, keyof typeof positions, keyof typeof positions][][] = [
  [
    [0, 3, 1],
    [0, 1, 5],
    [0, 5, 3],
    [1, 3, 5]
  ],
  [
    [0, 2, 3],
    [0, 6, 2],
    [0, 3, 6],
    [2, 6, 3]
  ],
  [
    [0, 5, 4],
    [0, 4, 6],
    [0, 6, 5],
    [4, 5, 6]
  ],
  [
    [0, 5, 6],
    [0, 3, 5],
    [3, 0, 6],
    [3, 6, 5]
  ],
  [
    [5, 7, 6],
    [5, 3, 7],
    [3, 6, 7],
    [3, 5, 6]
  ]
];

export const getVertexForMatrix = (v: [number, number, number], M?: THREE.Matrix4): [number, number, number] => {
  if (!M) return v as [number, number, number];

  const v4 = new THREE.Vector4(v[0], v[1], v[2], 1);
  v4.applyMatrix4(M);
  return [v4.x, v4.y, v4.z];
};

const createTetrahedronGeometry = (faces: FaceTypes[0]): [THREE.BufferGeometry, [number, number, number]] => {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const indexes = new Set<keyof typeof positions>();

  // Add all vertices for this tetrahedron
  faces.forEach((face, faceIndex) => {
    face.forEach((vertexIndex) => {
      const v = [0, 1, 2].map((i) => positions[vertexIndex][i]);
      indexes.add(vertexIndex);
      vertices.push(...v);
    });

    // Create indices for the triangle face
    const baseIndex = faceIndex * 3;
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
  });

  const c = [...indexes.values()].reduce(
    (v, fI) => [0, 1, 2].map((i) => positions[fI][i] * 0.25 + v[i]) as [number, number, number],
    [0, 0, 0] as [number, number, number]
  );

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return [geometry, c];
};

export const tetrahedronGeometries = tetrahedrons.map(createTetrahedronGeometry);
