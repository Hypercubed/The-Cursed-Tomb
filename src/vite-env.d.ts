/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TombDebug {
  enable(): void;
  disable(): void;
  toggle(): void;
  isEnabled(): boolean;
  help(): void;
}

interface Window {
  tombDebug?: TombDebug;
  __tombDebugHintPrinted?: boolean;
}
