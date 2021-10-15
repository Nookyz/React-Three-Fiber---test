import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

import { useFrame, useLoader } from '@react-three/fiber';

import './shaders/Test';

const Fade: React.FC = () => {
  const ref = useRef<any>();

  const resolution = useMemo(() => ({
    x: window.innerWidth,
    y: window.innerHeight,
  }), []);

  useFrame(({ clock }) => {
    ref.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[9, 9, 32, 32]} />
      <testMaterial ref={ref} uResolution={resolution} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Fade;
