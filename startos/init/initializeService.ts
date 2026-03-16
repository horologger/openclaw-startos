import { mkdir } from 'fs/promises'
import { openclawJson } from '../fileModels/openclaw.json'
import { startCliConfigYaml } from '../fileModels/startCliConfig.yaml'
import { sdk } from '../sdk'
import { mainMounts } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  // Get the OS IP and set url to startos/config.yaml
  const osIp = await sdk.getOsIp(effects)
  const hostUrl = `https://${osIp}`

  await mkdir(sdk.volumes.main.subpath('.startos'), { recursive: true })

  await startCliConfigYaml.merge(effects, { host: hostUrl })

  // Seed workspace bootstrap files — only copy if they don't already exist.
  // On upgrades this preserves the agent's customized IDENTITY, accumulated
  // MEMORY, and any user edits to SOUL or HEARTBEAT.
  // To reset a file to its default, delete it and reinstall/restart the service.
  await mkdir(sdk.volumes.main.subpath('.openclaw/workspace/memory'), {
    recursive: true,
  })
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'openclaw' },
    mainMounts(),
    'copy-soul',
    async (subc) => {
      const seedFiles = [
        'SOUL.md',
        'IDENTITY.md',
        'HEARTBEAT.md',
        'MEMORY.md',
      ]

      // Detect which files already exist before seeding
      const existCheck = await subc.exec(
        [
          'sh',
          '-c',
          seedFiles
            .map((f) => `test -f /data/.openclaw/workspace/${f} && echo ${f}`)
            .join('; '),
        ],
        { user: 'root' },
      )
      const preserved = String(existCheck.stdout).trim().split('\n').filter(Boolean)

      // Copy only missing files
      const conditionalCopies = seedFiles
        .map(
          (f) =>
            `test -f /data/.openclaw/workspace/${f} || cp /opt/workspace/${f} /data/.openclaw/workspace/${f}`,
        )
        .join('; ')
      await subc.execFail(['sh', '-c', conditionalCopies], { user: 'root' })

      if (preserved.length > 0) {
        console.info(
          `[workspace] Existing files preserved during upgrade: ${preserved.join(', ')}. ` +
            'To restore defaults, delete the file(s) from .openclaw/workspace/ and reinstall.',
        )
      }
    },
  )

  // Ensure OpenClaw config has required values on disk (zod catches protect our reads,
  // but OpenClaw reads the JSON directly)
  await openclawJson.merge(effects, {
    gateway: {
      auth: { mode: 'password' },
      controlUi: {
        enabled: true,
        allowInsecureAuth: true,
        dangerouslyAllowHostHeaderOriginFallback: true,
        dangerouslyDisableDeviceAuth: true,
      },
    },
    agents: {
      defaults: {
        heartbeat: { every: '24h' },
      },
    },
    skills: {
      load: { extraDirs: ['/opt/skills'] },
    },
  })
})
