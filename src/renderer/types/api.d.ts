export interface KnowListApi {
  openNewWindow: () => Promise<void>
}

declare global {
  interface Window {
    api: KnowListApi
  }
}
