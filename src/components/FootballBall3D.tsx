'use client';

import {Suspense, useMemo, useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/balon-futbol.glb';

/* The football GLB, recentred and normalised to a unit size, rotating slowly on
   its Y axis. */
function BallMesh() {
  const {scene} = useGLTF(MODEL_PATH);
  const group = useRef<THREE.Group>(null);

  const {centered, scale} = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    scene.position.sub(center);
    return {centered: scene, scale: 1.5 / maxDim};
  }, [scene]);

  useFrame(() => {
    const g = group.current;
    if (g) g.rotation.y += 0.008;
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={centered} />
    </group>
  );
}

/* Transparent canvas (sized via width/height props, default 80): ambient fill +
   a top-left key light, no controls. */
export function FootballBall3D({
  width = 80,
  height = 80
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Canvas
      camera={{position: [0, 0, 3], fov: 35}}
      gl={{alpha: true, antialias: true}}
      dpr={[1, 2]}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'transparent'
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 3, 4]} intensity={1.2} />
      <Suspense fallback={null}>
        <BallMesh />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);

export default FootballBall3D;
