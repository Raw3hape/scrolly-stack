/**
 * Scene internals barrel export.
 *
 * All canvas-only sub-components used by Scene.tsx.
 * Import via: import { Lights, Effects, ... } from './scene';
 */

export { default as SceneLoader } from './SceneLoader';
export { default as Lights } from './Lights';
export { default as Effects } from './Effects';
export { default as MouseParallaxGroup } from './MouseParallaxGroup';
export { CameraRig, ZoomController, useResponsiveZoom } from './camera';
