import { db } from '../db/cvDatabase';

export async function exportAllResumesBackup(): Promise<void> {
  const allProfiles = await db.profiles.toArray();
  const backupObject = {
    app: 'cvire',
    version: '1.0.0',
    exportedAt: Date.now(),
    profilesCount: allProfiles.length,
    profiles: allProfiles,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObject, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', `cvire-backup-all-${Date.now()}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
