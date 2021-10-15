import React from 'react';
import styled from 'styled-components';

import Scene from '@components/Scene';

import Fade from '@components/Fade';

const Example: React.FC = () => (
  <View>
    <Container>
      <BoxImage>
        <Scene>
          <Fade
            images={[
              '/assets/img3.jpg',
              '/assets/img4.jpg',
              '/assets/displacement/disp8.jpg',
            ]}
            effectFactor={-0.65}
          />
        </Scene>
      </BoxImage>
    </Container>
  </View>
);

const View = styled.div`
  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;

  background: #181818;
`;

const Container = styled.div`
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoxImage = styled.div`
  width: 30vw;
  min-width: 400px;
  height: 60vh;
  position: relative;
`;

export default Example;
