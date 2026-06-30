'use client';

import {Suspense, useMemo, useRef} from 'react';
import {Canvas, useFrame, useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const MODEL_PATH = '/models/balon-futbol.glb';

/* The football GLB, centered, normalized to a unit size and tumbling on a
   tilted axis so it reads like a spinning/rolling ball.

   Loaded with three's own GLTFLoader (via r3f's useLoader) — no drei. The
   loaded scene is cloned before we touch it, so we never mutate the shared
   cached gltf and the model stays correctly centered/proportioned. */
function BallMesh() {
  const gltf = useLoader(GLTFLoader, MODEL_PATH);
  const group = useRef<THREE.Group>(null);

  const {centered, scale} = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    scene.position.sub(center); // recenter the clone at the origin
    return {centered: scene, scale: 1.5 / maxDim};
  }, [gltf]);

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

useLoader.preload(GLTFLoader, MODEL_PATH);
