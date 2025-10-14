/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POETRY_API?: string
  readonly VITE_JRS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}