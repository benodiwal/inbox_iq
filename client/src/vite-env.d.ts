/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_BASE_URL: string;
    readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
