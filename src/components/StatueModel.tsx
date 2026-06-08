'use client';

import {Suspense, useMemo} from 'react';
import {Canvas} from '@react-three/fiber';
import {useGLTF, OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/statue.glb';

function Statue() {
  const {scene} = useGLTF(MODEL_PATH);

  const {center, scale} = useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#C0C0C0',
          metalness: 0.6,
          roughness: 0.3
        });
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(c);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return {center: c, scale: 2.5 / maxDim};
  }, [scene]);

  return (
    <group
      rotation={[0, THREE.MathUtils.degToRad(-140), 0]}
      position={[-center.x * scale, -center.y * scale + 0.7, -center.z * scale]}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export function StatueModel() {
  return (
    <Canvas
      gl={{alpha: true, antialias: true}}
      camera={{position: [0, 2.83, 5], fov: 30}}
      dpr={[1, 2]}
      style={{width: '100%', height: '100vh', background: 'transparent'}}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 5, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-3, 3, 2]} intensity={2} color="#ffffff" />
      <directionalLight position={[0, 2, -3]} intensity={1} color="#aaaaaa" />

      <Suspense fallback={null}>
        <Statue />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
}
