import React from 'react'

function getVaultFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('vault')
}

export default function App(): React.ReactElement {
  const vault = getVaultFromUrl()

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* macOS traffic light spacer */}
      <div className="h-10 w-full shrink-0" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="flex-1 flex items-center justify-center">
        {vault ? (
          <p className="text-sm text-neutral-400">
            Vault: <span className="font-mono">{vault}</span>
          </p>
        ) : (
          <p className="text-sm text-neutral-400">No vault open — launch screen coming next</p>
        )}
      </main>
    </div>
  )
}
