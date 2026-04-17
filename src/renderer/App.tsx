import React, { useState } from 'react'
import LaunchScreen from './components/LaunchScreen/LaunchScreen'
import Layout from './components/Layout/Layout'

function getVaultFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('vault')
}

export default function App(): React.ReactElement {
  const [vault, setVault] = useState<string | null>(getVaultFromUrl())

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* macOS traffic light spacer */}
      <div className="h-10 w-full shrink-0" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="flex-1 overflow-hidden">
        {vault ? (
          <Layout vaultPath={vault} />
        ) : (
          <LaunchScreen onVaultOpen={setVault} />
        )}
      </main>
    </div>
  )
}