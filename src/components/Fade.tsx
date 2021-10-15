import { useRef, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { useFrame, useLoader, useThree } from '@react-three/fiber';

import './shaders/Fade';

interface Props {
  images: string[];
  effectFactor: number;
}

const Fade: React.FC<Props> = ({
  images = [
    '/assets/img1.jpg',
    '/assets/img2.jpg',
    '/assets/disp.jpg',
  ],
  effectFactor = 0.8,
}) => {
  const ref = useRef<any>();

  const [hovered, setHover] = useState<any>(false);

  const [texture1, texture2, dispTexture] = useLoader(THREE.TextureLoader, images);

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
      <imageFadeMaterial
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        effectFactor={effectFactor}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Background = styled.div`
  text-align: center;
  background: tomato;
  padding: 10px 15px;
  border-radius: 5px;
  width: 300px;
`;

const Text = styled.p`
  font-size: 24px;
  color: #181818;
`;

export default Fade;
