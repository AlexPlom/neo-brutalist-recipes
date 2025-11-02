interface ImportMetaEnv {
  readonly NG_APP_RECIPES_API?: string;
  readonly NG_APP_RECIPES_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    NG_APP_RECIPES_API?: string;
    NG_APP_RECIPES_API_URL?: string;
  }
}

export {};
