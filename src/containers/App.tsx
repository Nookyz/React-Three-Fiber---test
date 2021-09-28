import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import { normalize } from 'styled-normalize';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import store from '@/store';

import Shaders from '@components/Shaders';
import Model from '@components/Model';

const GlobalStyle = createGlobalStyle`
  ${normalize};

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background: #fefefe;
  }

`;

const App: React.FC = () => (
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyle />
      <Suspense fallback={<div>loading...</div>}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
        >
          <Shaders />
          <OrbitControls
            enablePan={false}
            zoomSpeed={1}
            minDistance={8}
            maxDistance={20}
          />
        </Canvas>
      </Suspense>
    </Provider>
  </BrowserRouter>
);

export default App;
