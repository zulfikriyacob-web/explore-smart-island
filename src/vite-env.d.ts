/// <reference types="vite/client" />

// Vite handles CSS as a side-effect import; TypeScript needs telling.
declare module '*.css';
