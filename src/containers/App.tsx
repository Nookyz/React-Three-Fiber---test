import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import { normalize } from 'styled-normalize';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import store from '@/store';

import Scene from '@components/Scene';

// import Shaders from '@components/Shaders';
// import Model from '@components/Model';
import Fade from '@components/Fade';
import Test from '@components/Test';
import Example from '@containers/Example';
import SecondExample from '@containers/SecondExample';

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
    /* -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden; */
  }

  #root {
    &:before {
    z-index: 999;
    position: fixed;
    content: '';
    height: 300%;
    width: 300%;
    top: -100%;
    left: -50%;
    pointer-events: none;
    user-select: none;
    background-image: url('http://momentsingraphics.de/Media/BlueNoise/WhiteNoiseDithering.png');
    opacity: 0.03;
    animation: noise 8s steps(10) infinite;
  }
  }

  @keyframes noise {
    0%, 100% { transform:translate(0, 0); }
    10% { transform:translate(-5%, -10%); }
    20% { transform:translate(-15%, 5%); }
    30% { transform:translate(7%, -25%); }
    40% { transform:translate(-5%, 25%); }
    50% { transform:translate(-15%, 10%); }
    60% { transform:translate(15%, 0%); }
    70% { transform:translate(0%, 15%); }
    80% { transform:translate(3%, 35%); }
    90% { transform:translate(-10%, 10%); }
  }
`;

const App: React.FC = () => (
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyle />
      <Suspense fallback={<div>loading...</div>}>
        <SecondExample />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

export default App;
