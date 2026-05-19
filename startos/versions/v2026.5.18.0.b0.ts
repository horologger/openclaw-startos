import { VersionInfo } from '@start9labs/start-sdk'

export const v_2026_5_18_0_b0 = VersionInfo.of({
  version: '2026.5.18:0-beta.0',
  releaseNotes: {
    en_US: 'Update to upstream 2026.5.18.',
    es_ES: 'Actualización a upstream 2026.5.18.',
    de_DE: 'Update auf Upstream 2026.5.18.',
    pl_PL: 'Aktualizacja do upstream 2026.5.18.',
    fr_FR: 'Mise à jour vers upstream 2026.5.18.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
