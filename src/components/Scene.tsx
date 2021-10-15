import React from 'react';
import styled from 'styled-components';

import { Canvas } from '@react-three/fiber';

interface Props {
  children: React.ReactNode;
  camera?: any;
}

// camera={{ position: [0, 0, 10], fov: 45 }}

const Scene: React.FC<Props> = ({
  children,
  camera = {},
}) => (
  <CanvasScene camera={camera}>
    {children}
  </CanvasScene>
);

const CanvasScene = styled(Canvas)`
  width: 100%;
  height: 100%;
`;

export default Scene;
