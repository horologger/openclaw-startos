import { VersionInfo } from '@start9labs/start-sdk'

export const v_2026_4_2_0_b0 = VersionInfo.of({
  version: '2026.4.2:0-beta.0',
  releaseNotes: {
    en_US: 'Update to upstream 2026.4.2.',
    es_ES: 'Actualización a upstream 2026.4.2.',
    de_DE: 'Update auf Upstream 2026.4.2.',
    pl_PL: 'Aktualizacja do upstream 2026.4.2.',
    fr_FR: 'Mise à jour vers upstream 2026.4.2.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
