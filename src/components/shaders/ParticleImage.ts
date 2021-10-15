import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export default class ParticleImageMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        progress: { value: 0 },
        t1: { value: undefined },
        t2: { value: undefined },
        mask: { value: undefined },
        mouse: { value: null },
        uMove: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec2 vCoordinates;
        varying vec3 vPos;
        
        attribute vec3 aCoordinates;
        attribute float aSpeed;
        attribute float aOffset;
        attribute float aDirection;
        attribute float aPress;
        
        uniform float uMove;
        uniform float uTime;
        uniform vec2 mouse;
        
        void main() {
          vUv = uv;
      
          vec3 pos = position;
      
          // NOT STABLE
          pos.x += sin(uMove * aSpeed) * 10.0;
          pos.y += sin(uMove * aSpeed) * 10.0;
          pos.z = mod(position.z + uMove * 150.0 * aSpeed + aOffset, 2000.0) - 1000.0;
      
          // STABLE
          vec3 stable = position;
          float dist = distance(stable.xy, mouse);
          float area = 1.0 - smoothstep(0.0, 250.0, dist);
      
          stable.x += 50.0 * sin( 0.1 * uTime * aPress) * aDirection * area;
          stable.y += 50.0 * sin( 0.1 * uTime * aPress) * aDirection * area;
          stable.z += 200.0 * cos( 0.1 * uTime * aPress) * aDirection * area;
      
          // STABLE
          vec4 mvPosition = modelViewMatrix * vec4(stable, 1.0);
      
          gl_PointSize = 2500.0 * (1.0 / - mvPosition.z);
      
          gl_Position = projectionMatrix * mvPosition;
      
          vCoordinates = aCoordinates.xy;
          vPos = pos;
        }
      `,
      fragmentShader: `
        varying vec2 vCoordinates;
        varying vec3 vPos;
        
        uniform sampler2D t1;
        uniform sampler2D t2;
        uniform sampler2D mask;
        
        void main(){
          // vec4 maskTexture = texture2D(mask, gl_PointCoord);
      
          vec2 myUv = vec2(vCoordinates.x / 512.0, vCoordinates.y / 512.0);
      
          vec4 image = texture2D(t1, myUv);
      
          float alpha = 1.0 - clamp(0.0, 1.0, abs(vPos.z / 9000.0));
      
          gl_FragColor = image;
          gl_FragColor.a *= alpha;
          
          // gl_FragColor = vec4(vCoordinates.x / 512.0, vCoordinates.y / 512.0, 0.0, 1.0);
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

extend({ ParticleImageMaterial });
