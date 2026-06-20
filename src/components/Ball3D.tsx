'use client';

import {Suspense, useMemo, useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/balon-futbol.glb';

/* The football GLB, centered, normalized to a unit size and tumbling on a
   tilted axis so it reads like a spinning/rolling ball. */
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
    scene.position.sub(center); // recenter at origin
    return {centered: scene, scale: 1.5 / maxDim};
  }, [scene]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 1.1;
    g.rotation.x += delta * 0.45;
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={centered} />
    </group>
  );
}

export function Ball3D() {
  return (
    <Canvas
      camera={{position: [0, 0, 3], fov: 35}}
      gl={{alpha: true, antialias: true}}
      dpr={[1, 2]}
      style={{width: '100%', height: '100%', background: 'transparent'}}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={1.6} />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} />
      <Suspense fallback={null}>
        <BallMesh />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
