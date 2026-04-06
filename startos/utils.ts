import { sdk } from './sdk'

export const uiPort = 18789

// StartOS version for start-cli - update this to match your target StartOS version
export const STARTOS_VERSION = '0.4.0-beta.0'

export function mainMounts() {
  return sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })
}
