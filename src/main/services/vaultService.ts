import { app } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { VaultMeta } from '@shared/types'

const RECENT_PATH = join(app.getPath('userData'), 'recentVaults.json')
const MAX_RECENT = 10

export async function getRecentVaults(): Promise<VaultMeta[]> {
  try {
    if (!existsSync(RECENT_PATH)) return []
    const raw = await readFile(RECENT_PATH, 'utf-8')
    return JSON.parse(raw) as VaultMeta[]
  } catch {
    return []
  }
}

export async function addRecentVault(vaultPath: string): Promise<void> {
  const recent = await getRecentVaults()
  const meta: VaultMeta = {
    path: vaultPath,
    name: vaultPath.split('/').pop() ?? vaultPath,
    lastOpened: new Date().toISOString(),
  }
  const updated = [meta, ...recent.filter((v) => v.path !== vaultPath)].slice(0, MAX_RECENT)
  await writeFile(RECENT_PATH, JSON.stringify(updated, null, 2), 'utf-8')
}
