import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

export const vertexShader = `
  uniform vec2 uFrequency;
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;

  void main()
  {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
  }
`;

export const fragmentShader = `
  uniform vec3 uColor;
  uniform sampler2D uTexture;

  varying vec2 vUv;
  varying float vElevation;

  void main()
  {
    gl_FragColor = vec4(vUv, 1.0, 1.0);
  }
`;

const Shaders: React.FC = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uFrequency: { value: new THREE.Vector2(10, 5) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('orange') },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    uniforms.uTime.value = elapsedTime * 2;
  });

  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[5, 5, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        attach="material"
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Shaders;
