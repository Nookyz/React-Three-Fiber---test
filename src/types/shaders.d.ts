import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      testMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
      particleImageMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
      imageFadeMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
    }
  }
}
