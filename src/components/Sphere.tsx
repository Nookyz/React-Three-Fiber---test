/* eslint-disable max-len */
import React, { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

import {
  perlin4d,
  perlin3d,
  permute,
  taylorInvSqrt,
} from '@components/shaders/common/Common';

export const vertexShader = `
  uniform float uTime;

  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;
  uniform float uDisplacementFrequency;
  uniform float uDisplacementStrength;
  uniform float uTimeFrequency;

  varying vec3 vNormal;
  varying float vPerlonStrength;

  ${permute}
  ${taylorInvSqrt}

  ${perlin4d}
  ${perlin3d}

  void main() {
    vec3 displacementPosition = position;
    displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency, uTime * uTimeFrequency)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * uTimeFrequency)) * uDisplacementStrength;

    vec3 newPosition = position;

    newPosition += normal * perlinStrength;

    vec4 viewPosition = viewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
    vPerlonStrength = perlinStrength;
  }
`;

// displacementPosition.x = perlin3d(vec3(position.yz * uDistortionFrequency, uTime * 0.2)) * uDistortionStrength;
// displacementPosition.y = perlin3d(vec3(position.xz * uDistortionFrequency, uTime * 0.2)) * uDistortionStrength;
// displacementPosition.z = perlin3d(vec3(position.xy * uDistortionFrequency, uTime * 0.2)) * uDistortionStrength;

export const fragmentShader = `
  uniform float uR;
  uniform float uG;
  uniform float uB;

  varying vec3 vNormal;
  varying float vPerlonStrength;

  void main(){
    float temp = vPerlonStrength + 0.5;
    temp *= 0.5;

    gl_FragColor = vec4(temp / uR, temp / uG, temp / uB, 1.0);
  }
`;

export const uniforms = {
  uTime: { value: 0 },
  uTimeFrequency: { value: 0.1 },
  uDistortionFrequency: { value: 1.6 },
  uDistortionStrength: { value: 1.2 },
  uDisplacementFrequency: { value: 2.0 },
  uDisplacementStrength: { value: 0.3 },
  // Colors
  uR: { value: 0.0 },
  uG: { value: 0.6 },
  uB: { value: 0.8 },
};

const shaders = { vertexShader, fragmentShader };

const Sphere: React.FC = () => {
  const ref = useRef<THREE.ShaderMaterial>(null!);

  const {
    uTimeFrequency,
    uDistortionFrequency,
    uDistortionStrength,
    uDisplacementFrequency,
    uDisplacementStrength,
    // Colors
    uR,
    uG,
    uB,
  } = useControls({
    uTimeFrequency: {
      value: 0.1, min: 0, max: 2, step: 0.01,
    },
    uDistortionFrequency: {
      value: 1.6, min: 0, max: 10, step: 0.01,
    },
    uDistortionStrength: {
      value: 1.2, min: 0, max: 10, step: 0.01,
    },
    uDisplacementFrequency: {
      value: 2.0, min: 0, max: 10, step: 0.01,
    },
    uDisplacementStrength: {
      value: 0.3, min: 0, max: 10, step: 0.01,
    },
    uR: {
      value: 0.0, min: 0, max: 1, step: 0.001,
    },
    uG: {
      value: 0.6, min: 0, max: 1, step: 0.001,
    },
    uB: {
      value: 0.8, min: 0, max: 1, step: 0.001,
    },
  });

  useFrame(({ clock }) => {
    ref.current.uniforms.uTime.value = clock.getElapsedTime();
    ref.current.uniforms.uTimeFrequency.value = uTimeFrequency;
    ref.current.uniforms.uDistortionFrequency.value = uDistortionFrequency;
    ref.current.uniforms.uDistortionStrength.value = uDistortionStrength;
    ref.current.uniforms.uDisplacementFrequency.value = uDisplacementFrequency;
    ref.current.uniforms.uDisplacementStrength.value = uDisplacementStrength;

    // Colors
    ref.current.uniforms.uR.value = uR;
    ref.current.uniforms.uG.value = uG;
    ref.current.uniforms.uB.value = uB;
  });

  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[2, 512, 512]} />
      {/* <meshBasicMaterial wireframe /> */}
      <shaderMaterial
        ref={ref}
        attach="material"
        args={[shaders]}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Sphere;
