import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated, config } from '@react-spring/three';

interface Props {
  position: [number, number, number];
  color: string;
}

const Box: React.FC<Props> = ({ position, color = 'orange' }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const texture = useLoader(TextureLoader, '/assets/weed.jpg');

  const { scale } = useSpring({
    scale: active ? 1.3 : 1,
    config: config.slow,
  });

  useFrame(({ clock }) => {
    // This function runs 60 times/second inside the global render-loop
    mesh.current.rotation.x += (Math.PI * 0.01) / 10;
    mesh.current.rotation.y += (Math.PI * 0.01) / 10;
    mesh.current.rotation.z += (Math.PI * 0.01) / 10;

    const time = clock.getElapsedTime();

    mesh.current.position.y = Math.cos(time * 1.5);
    mesh.current.position.x = 4 * (Math.cos(time * 1.5));
    mesh.current.position.z = 4 * (Math.cos(time * 2.0));
  });

  const handleClick = useCallback(() => {
    setActive(!active);
  }, [active]);

  const onPointerOver = useCallback(() => {
    setHover(true);
  }, []);

  const onPointerOut = useCallback(() => {
    setHover(false);
  }, []);

  return (
    <animated.mesh
      position={position}
      ref={mesh}
      scale={scale}
      onClick={handleClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} color={hovered ? '#ddcb90' : color} />
    </animated.mesh>
  );
};

export default Box;
