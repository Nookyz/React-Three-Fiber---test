/* eslint-disable no-return-assign */
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export default class ImageFadeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        effectFactor: { value: 1.2 },
        dispFactor: { value: 0 },
        tex: { value: undefined },
        tex2: { value: undefined },
        disp: { value: undefined },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;

        uniform float uTime;

        const float PI=3.1415926;

        void main() {
          vUv = uv;
          vec3 newPosition=position;
          newPosition.z+=.1*sin((newPosition.x+uTime)*2.*PI);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.);
          // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        varying vec2 vUv;

        uniform sampler2D tex;
        uniform sampler2D tex2;
        uniform sampler2D disp;

        uniform float dispFactor;
        uniform float effectFactor;
        
        void main() {
          vec2 uv = vUv;
          vec4 disp = texture2D(disp, uv);
          vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r*effectFactor));
          vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - dispFactor) * (disp.r*effectFactor));
          vec4 _texture = texture2D(tex, distortedPosition);
          vec4 _texture2 = texture2D(tex2, distortedPosition2);
          vec4 finalTexture = mix(_texture, _texture2, dispFactor);
          gl_FragColor = finalTexture;
        }
      `,
    });
  }

  get effectFactor() {
    return this.uniforms.effectFactor.value;
  }

  set effectFactor(v) {
    this.uniforms.effectFactor.value = v;
  }

  get dispFactor() {
    return this.uniforms.dispFactor.value;
  }

  set dispFactor(v) {
    this.uniforms.dispFactor.value = v;
  }

  get tex() {
    return this.uniforms.tex.value;
  }

  set tex(v) {
    this.uniforms.tex.value = v;
  }

  get tex2() {
    return this.uniforms.tex2.value;
  }

  set tex2(v) {
    this.uniforms.tex2.value = v;
  }

  get disp() {
    return this.uniforms.disp.value;
  }

  set disp(v) {
    this.uniforms.disp.value = v;
  }
}

extend({ ImageFadeMaterial });
