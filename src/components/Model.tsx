import React from 'react';

import Box from '@components/Box';
import Text from '@components/Text';
import Lights from '@components/Lights';

interface Props {}

const Model: React.FC<Props> = () => (
  <>
    <Lights />
    <Box position={[0, 0, 0]} color="#3bda78" />
    {/* <Box position={[2.2, 0, 0]} color="#3bda78" /> */}
    <Text text="Hello Three.js" />
    {/* <Stars
      radius={80} // Radius of the inner sphere (default=100)
      depth={10} // Depth of area where stars should fit (default=50)
      count={3000} // Amount of stars (default=5000)
      factor={4} // Size factor (default=4)
      saturation={0} // Saturation 0-1 (default=0)
      fade // Faded dots (default=false)
    /> */}
  </>
);

export default Model;
