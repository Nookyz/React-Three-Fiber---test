import React from 'react';
import styled from 'styled-components';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Sphere from '@components/Sphere';
import Lights from '@components/Lights';

const Example: React.FC = () => (
  <View>
    <Container>
      <Canvas>
        <Lights />
        <Sphere />
        <OrbitControls />
      </Canvas>
    </Container>
  </View>
);

const View = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #111518;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default Example;
