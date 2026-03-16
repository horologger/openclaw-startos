import { VersionInfo } from '@start9labs/start-sdk'

export const v_2026_3_13_0_b0 = VersionInfo.of({
  version: '2026.3.13:0-beta.0',
  releaseNotes: {
    en_US:
      'Update to upstream 2026.3.13. Workspace files (SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md) are now preserved on upgrades — your agent identity and memories will no longer be overwritten. To restore a file to its default, delete it from .openclaw/workspace/ and reinstall.',
    es_ES:
      'Actualización a upstream 2026.3.13. Los archivos del espacio de trabajo (SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md) ahora se conservan durante las actualizaciones — la identidad y los recuerdos de su agente ya no se sobrescriben. Para restaurar un archivo a su valor predeterminado, elimínelo de .openclaw/workspace/ y reinstale.',
    de_DE:
      'Update auf Upstream 2026.3.13. Workspace-Dateien (SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md) werden bei Updates jetzt beibehalten — die Identität und Erinnerungen Ihres Agenten werden nicht mehr überschrieben. Um eine Datei auf den Standard zurückzusetzen, löschen Sie sie aus .openclaw/workspace/ und installieren Sie neu.',
    pl_PL:
      'Aktualizacja do upstream 2026.3.13. Pliki przestrzeni roboczej (SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md) są teraz zachowywane podczas aktualizacji — tożsamość i wspomnienia agenta nie będą już nadpisywane. Aby przywrócić plik do wartości domyślnej, usuń go z .openclaw/workspace/ i zainstaluj ponownie.',
    fr_FR:
      "Mise à jour vers upstream 2026.3.13. Les fichiers d'espace de travail (SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md) sont désormais préservés lors des mises à jour — l'identité et les souvenirs de votre agent ne seront plus écrasés. Pour restaurer un fichier par défaut, supprimez-le de .openclaw/workspace/ et réinstallez.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
