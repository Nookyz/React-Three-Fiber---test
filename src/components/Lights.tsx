import { useRef } from 'react';
import { useHelper } from '@react-three/drei';

import { PointLightHelper } from 'three';

const Lights: React.FC = () => {
  const pointLight = useRef<THREE.PointLight>();

  // useHelper(pointLight, PointLightHelper, 0.5, 'hotpink');
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} args={['white', 2, 100, 5]} ref={pointLight} />
      {/* <pointLightHelper args={[ref, 1]} /> */}
      {/* <gridHelper args={[30, 30, 30]} /> */}
      <fog attach="fog" args={['#b38cd8', 0, 40]} />
    </>
  );
};

export default Lights;
