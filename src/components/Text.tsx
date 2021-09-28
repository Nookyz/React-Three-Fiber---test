import React from 'react';
import { Text } from '@react-three/drei';

interface Props {
  text: string;
}

const CanvasText: React.FC<Props> = ({ text }) => (
  <Text
    position={[0, 2.5, 0]}
    fontSize={1}
    color="#fff"
    font="/assets/Branda-yolq.ttf"
    material-fog={false}
    letterSpacing={0.01}
  >
    {text}
  </Text>
);

export default CanvasText;
