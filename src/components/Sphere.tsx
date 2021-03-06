/* eslint-disable max-len */
import React, { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

import {
  perlin4d,
  perlin3d,
} from '@components/shaders/common/Common';

export const vertexShader = `
  uniform float uTime;

  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;
  uniform float uDisplacementFrequency;
  uniform float uDisplacementStrength;
  uniform float uTimeFrequency;

  varying vec3 vNormal;
  varying float vPerlinStrength;
  varying vec3 vColor;

  uniform float uR;
  uniform float uG;
  uniform float uB;

  ${perlin4d}
  ${perlin3d}

  vec4 getDisplacedPosition(vec3 _position){
    vec3 displacementPosition = _position;
    displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency, uTime * uTimeFrequency)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * uTimeFrequency)) * uDisplacementStrength;

    vec3 displacedPosition = _position;

    displacedPosition += normalize(_position) * perlinStrength * uDisplacementStrength;

    return vec4(displacedPosition, perlinStrength);
  }

  float getColor(float c){
    return cos(c + uTime) * uTime * 0.03;
  }

  void main() {
    // Positon
    vec4 displacementPosition = getDisplacedPosition(position);
    vec4 viewPosition = viewMatrix * vec4(displacementPosition.xyz, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    //  Color
    vec3 uLightAColor = vec3(1.0, 0.2, 0.5);
    vec3 uLightAPosition = vec3(1.0, 1.0, 0.0);
    float lightAIntensity = max(0.0, - dot(normal, normalize(- uLightAPosition)));

    vec3 uLightBColor = vec3(0.5, 0.2, 1.0);
    vec3 uLightBPosition = vec3(-1.0, -0.5, 0.0);
    float lightBIntensity = max(0.0, - dot(normal, normalize(- uLightBPosition)));

    vec3 color = vec3(1.0);
    color = mix(color, uLightAColor, lightAIntensity);
    color = mix(color, uLightBColor, lightBIntensity);

    //  Varying
    vNormal = normal;
    vPerlinStrength = displacementPosition.a;
    vColor = color;
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uTimeFrequency;

  uniform float uR;
  uniform float uG;
  uniform float uB;

  varying vec3 vNormal;
  varying float vPerlinStrength;
  varying vec3 vColor;

  void main(){
    gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor = vec4(vColor.r / uR, vColor.g / uG, vColor.b / uB, 1.0);


    // float temp = vPerlinStrength + 0.5;
    // temp *= 0.5;

    
    // gl_FragColor = vec4(temp , temp, temp, 1.0);
    // gl_FragColor = vec4(temp / uR, temp / uG, temp / uB, 1.0);
  }
`;

export const uniforms = {
  uTime: { value: 0 },
  uTimeFrequency: { value: 0.1 },
  uDistortionFrequency: { value: 1.6 },
  uDistortionStrength: { value: 1.2 },
  uDisplacementFrequency: { value: 2.0 },
  uDisplacementStrength: { value: 0.65 },
  // Colors
  uR: { value: 0.5 },
  uG: { value: 0.28 },
  uB: { value: 1.0 },
};

const shaders = { vertexShader, fragmentShader };

const Sphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

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
      value: 0.65, min: 0, max: 10, step: 0.01,
    },
    uR: {
      value: 0.5, min: 0, max: 1, step: 0.001,
    },
    uG: {
      value: 0.28, min: 0, max: 1, step: 0.001,
    },
    uB: {
      value: 1.0, min: 0, max: 1, step: 0.001,
    },
  });

  useFrame(({ clock }) => {
    // Mesh
    meshRef.current.rotation.x += 0.01;
    // Shader
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    shaderRef.current.uniforms.uTimeFrequency.value = uTimeFrequency;
    shaderRef.current.uniforms.uDistortionFrequency.value = uDistortionFrequency;
    shaderRef.current.uniforms.uDistortionStrength.value = uDistortionStrength;
    shaderRef.current.uniforms.uDisplacementFrequency.value = uDisplacementFrequency;
    shaderRef.current.uniforms.uDisplacementStrength.value = uDisplacementStrength;

    // Colors
    shaderRef.current.uniforms.uR.value = uR;
    shaderRef.current.uniforms.uG.value = uG;
    shaderRef.current.uniforms.uB.value = uB;
  });

  return (
    <mesh ref={meshRef}>
      <sphereBufferGeometry attach="geometry" args={[2, 512, 512]} />
      {/* <meshBasicMaterial wireframe /> */}
      <shaderMaterial
        ref={shaderRef}
        attach="material"
        args={[shaders]}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Sphere;
