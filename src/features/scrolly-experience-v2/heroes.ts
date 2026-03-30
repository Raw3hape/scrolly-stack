/**
 * Hero 3D Loaders — Separate entry point
 *
 * Split from the main barrel export so that pages using only
 * ScrollyExperience (e.g. homepage) don't bundle these heavy components.
 */

export { default as FreebieBook3D } from './components/FreebieBook3D';
export { default as HeroAscendingBlocks3DLoader } from './components/HeroAscendingBlocks3DLoader';
export { default as HeroExplodedGrid3DLoader } from './components/HeroExplodedGrid3DLoader';
export { default as HeroPyramid3DLoader } from './components/HeroPyramid3DLoader';
