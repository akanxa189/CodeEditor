/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deployed backend base URL including /api (e.g. https://your-backend.vercel.app/api) */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
