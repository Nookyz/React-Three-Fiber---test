import { useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame, useLoader } from '@react-three/fiber';

import './shaders/Fade';

const Fade = () => {
  const ref = useRef();

  const [hovered, setHover] = useState(false);

  const [texture1, texture2, dispTexture] = useLoader(THREE.TextureLoader, [
    '/assets/img1.jpg',
    '/assets/img2.jpg',
    '/assets/disp.jpg',
  ]);

  useFrame((state) => {
    ref.current.uniforms.uTime.value = state.clock.elapsedTime;
    ref.current.dispFactor = THREE.MathUtils.lerp(ref.current.dispFactor, !!hovered, 0.03);
  });

  return (
    <mesh
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeBufferGeometry attach="geometry" args={[5, 5, 32, 32]} />
      <imageFadeMaterial
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        effectFactor={-0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Fade;
