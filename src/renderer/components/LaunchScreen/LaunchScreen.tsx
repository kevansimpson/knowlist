import React, { useEffect, useState } from 'react'
import type { VaultMeta } from '@shared/types'

interface Props {
  onVaultOpen: (path: string) => void
}

export default function LaunchScreen({ onVaultOpen }: Props): React.ReactElement {
  const [recentVaults, setRecentVaults] = useState<VaultMeta[]>([])

  useEffect(() => {
    if (!window.api) return
    window.api.getRecentVaults().then(setRecentVaults)
  }, [])

  async function handleOpenPicker() {
    if (!window.api) return
    const path = await window.api.openVaultPicker()
    if (path) onVaultOpen(path)
  }

  async function handleOpenRecent(path: string) {
    if (!window.api) return
    await window.api.openVaultPath(path)
    onVaultOpen(path)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">KnowList</h1>

      <button
        onClick={handleOpenPicker}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Open Vault
      </button>

      {recentVaults.length > 0 && (
        <div className="flex flex-col gap-1 w-72">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Recent</p>
          {recentVaults.map((vault) => (
            <button
              key={vault.path}
              onClick={() => handleOpenRecent(vault.path)}
              className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <p className="text-sm font-medium">{vault.name}</p>
              <p className="text-xs text-neutral-400 truncate">{vault.path}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
