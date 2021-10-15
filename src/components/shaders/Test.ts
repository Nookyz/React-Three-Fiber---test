import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const gradientsColorsFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265359

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  vec3 colorA = vec3(0.149,0.141,0.912);
  vec3 colorB = vec3(1.000,0.833,0.224);

  float plot (vec2 st, float pct){
    return  smoothstep( pct-0.01, pct, st.y) -
            smoothstep( pct, pct+0.01, st.y);
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    // pct.r = smoothstep(0.0,1.0, st.x);
    // pct.g = sin(st.x*PI);
    // pct.b = pow(st.x,0.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
  }
`;

const HSBColorsFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define TWO_PI 6.28318530718

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  //  Function from Iñigo Quiles
  //  https://www.shadertoy.com/view/MsS3Wc
  vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) -3.0) - 1.0, 0.0, 1.0);

    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
  }

  void main(){
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
  }
`;

const mixColors2FragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  float rect(in vec2 st, in vec2 size){
    size = 0.25-size*0.25;
      vec2 uv = smoothstep(size,size+size*vec2(0.002),st*(1.0-st));
    return uv.x*uv.y;
  }

  void main() {
    vec2 st = vUv;

    vec3 influenced_color = vec3(0.745,0.678,0.539);
    
    vec3 influencing_color_A = vec3(0.653,0.918,0.985); 
    vec3 influencing_color_B = vec3(0.980,0.576,0.113);
    
    vec3 color = mix(influencing_color_A,
                     influencing_color_B,
                     step(.5,st.x));
    
    color = mix(color,
               influenced_color,
               rect(abs((st-vec2(.5,.0))*vec2(2.,1.)),vec2(.05,.125)));

    gl_FragColor = vec4(color,1.0);
  }
`;

const circlesFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  void main() {
    vec2 st = vUv;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    pct = distance(st,vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    vec3 color = vec3(pct);

    gl_FragColor = vec4( color, 1.0 );
  }
`;

const StepFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  

  void main() {
    vec2 st = vUv;
    float uThreshold = 0.5;

    float value = step(uThreshold, st.x);
    gl_FragColor = vec4(vec3(value), 1.0);
  }
`;

const CrossFragmentShader = `
  // Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
  }

  float cross(in vec2 _st, float _size){
      return  box(_st, vec2(_size,_size/4.)) +
              box(_st, vec2(_size/4.,_size));
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    // To move the cross we move the space
    vec2 translate = vec2(cos(uTime),sin(uTime));
    st += translate*0.35;

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.25));

    gl_FragColor = vec4(color,1.0);
  }
`;

const CrossScaleFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
  }

  float box(in vec2 _st, in vec2 _size){
      _size = vec2(0.5) - _size*0.5;
      vec2 uv = smoothstep(_size,
                          _size+vec2(0.001),
                          _st);
      uv *= smoothstep(_size,
                      _size+vec2(0.001),
                      vec2(1.0)-_st);
      return uv.x*uv.y;
  }

  float cross(in vec2 _st, float _size){
      return  box(_st, vec2(_size,_size/4.)) +
              box(_st, vec2(_size/4.,_size));
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    st -= vec2(0.5);
    st = scale( vec2(sin(uTime)+1.0) ) * st;
    st += vec2(0.5);

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.2));

    gl_FragColor = vec4(color,1.0);
  }
`;

// Patterns

const PatternsFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
  }

  void main(){
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    st *= 3.0;      // Scale up the space by 3
    st = fract(st); // Wrap around 1.0

    // Now we have 9 spaces that go from 0-1

    color = vec3(st,0.0);
    //color = vec3(circle(st,0.5));

    gl_FragColor = vec4(color,1.0);
  }
`;

const Patterns2FragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265358979323846

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
  }

  vec2 tile(vec2 _st, float _zoom){
      _st *= _zoom;
      return fract(_st);
  }

  float box(vec2 _st, vec2 _size, float _smoothEdges){
      _size = vec2(0.5)-_size*0.5;
      vec2 aa = vec2(_smoothEdges*0.5);
      vec2 uv = smoothstep(_size,_size+aa,_st);
      uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
      return uv.x*uv.y;
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(0.0);

    // Divide the space in 4
    st = tile(st,4.);

    // Use a matrix to rotate the space 45 degrees
    st = rotate2D(st,PI*0.25);

    // Draw a square
    color = vec3(box(st,vec2(0.7),0.01));
    // ==color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
  }
`;

// 2D Random

const RandomFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  float random (vec2 st, float time) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233 * time)))*
        43758.5453123);
  }

  void main() {
    vec2 st = vUv;

    float rnd = random( st, uTime );

    gl_FragColor = vec4(vec3(rnd),1.0);
  }
`;

// Noise

const NoiseCircleFragmentShader = `
  // Author @patriciogv - 2015
  // http://patriciogonzalezvivo.com

  // My own port of this processing code by @beesandbombs
  // https://dribbble.com/shots/1696376-Circle-wave

  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float shape(vec2 st, float radius) {
    st = vec2(0.5)-st;
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+uTime*2.,3.14*2.)-3.14)/3.6;
    float f = radius;
    m += noise(st+uTime*0.1)*.5;
    // a *= 1.+abs(atan(uTime*0.2))*.1;
    // a *= 1.+noise(st+uTime*0.1)*0.1;
    f += sin(a*50.)*noise(st+uTime*.2)*.1;
    f += (sin(a*20.)*.1*pow(m,2.));
    return 1.-smoothstep(f,f+0.007,r);
  }

  float shapeBorder(vec2 st, float radius, float width) {
    return shape(st,radius)-shape(st,radius-width);
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(1.0) * shapeBorder(st,0.8,0.02);

    gl_FragColor = vec4( 1.-color, 1.0 );
  }
`;

// Metaballs - Cellular Noise

const MetaballsNoiseFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }

  void main() {
    vec2 st = vUv;

    vec3 color = vec3(.0);

    // Scale
    st *= 5.;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.;  // minimum distance
    for (int j= -1; j <= 1; j++ ) {
      for (int i= -1; i <= 1; i++ ) {
        // Neighbor place in the grid
        vec2 neighbor = vec2(float(i),float(j));

        // Random position from current + neighbor place in the grid
        vec2 offset = random2(i_st + neighbor);

        // Animate the offset
        offset = 0.5 + 0.5*sin(uTime + 6.2831*offset);

        // Position of the cell
        vec2 pos = neighbor + offset - f_st;

        // Cell distance
        float dist = length(pos);

        // Metaball it!
        m_dist = min(m_dist, m_dist*dist);
      }
    }

    // Draw cells
    color += step(0.060, m_dist);

    gl_FragColor = vec4(color,1.0);
  }
`;

// Fractal Brownian Motion

const MotionFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
  }

  // Based on Morgan McGuire @morgan3d
  // https://www.shadertoy.com/view/4dS3Wd
  float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  #define NUM_OCTAVES 5

  float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = vUv*3.;
    
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*uTime);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

    float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
  }
`;

export default class TestMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
        }
      `,
      fragmentShader: MotionFragmentShader,
    });
  }

  get uTime() {
    return this.uniforms.uTime.value;
  }

  set uTime(v) {
    this.uniforms.uTime.value = v;
  }

  get uResolution() {
    return this.uniforms.uResolution.value;
  }

  set uResolution(v) {
    this.uniforms.uResolution.value = v;
  }
}

extend({ TestMaterial });

const defaultSetupFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;

  void main() {
    gl_FragColor = vec4(0.4, 0.5, 0.4, 1.0);
  }
`;

const mixColorsFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265359

  varying vec2 vUv;

  uniform float uTime; // uTime need undate from uniform

  vec3 colorA = vec3(0.149,0.141,0.912);
  vec3 colorB = vec3(1.000,0.833,0.224);

  void main() {
    vec2 uv = vUv;

    vec3 color = vec3(0.0);

    float pct = abs(sin(uTime));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
  }
`;
