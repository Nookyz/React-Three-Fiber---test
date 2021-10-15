import { useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame, useLoader, useThree } from '@react-three/fiber';

import './shaders/ParticleImage';

interface Props {
  images: string[];
}

const ParticleImage: React.FC<Props> = ({
  images = [
    '/assets/img1.jpg',
    '/assets/img2.jpg',
    '/assets/particle_mask.jpg',
  ],
}) => {
  const ref = useRef<any>();

  const [hovered, setHover] = useState<boolean>(false);

  const [texture1, texture2, mask] = useLoader(THREE.TextureLoader, images);

  const { width, height } = useThree((state) => state.viewport);

  useFrame((state) => {
    ref.current.uniforms.uTime.value = state.clock.elapsedTime;
    ref.current.dispFactor = THREE.MathUtils.lerp(
      ref.current.dispFactor, !!hovered as unknown as number, 0.03,
    );
  });

  return (
    <mesh
      scale={[width, height, 1]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeBufferGeometry attach="geometry" args={[1, 1, 16, 16]} />
      <particleImageMaterial
        ref={ref}
        t1={texture1}
        t2={texture2}
        mask={mask}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ParticleImage;
