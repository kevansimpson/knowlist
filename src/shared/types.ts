/**
 * IPC channel name constants — single source of truth for main, preload, and renderer.
 * New channels are added here as features are built.
 */
export const IPC = {
  APP_OPEN_NEW_WINDOW: 'app:open-new-window',
} as const

export type IpcChannel = typeof IPC[keyof typeof IPC]
