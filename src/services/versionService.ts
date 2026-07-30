import { db } from '../db/cvDatabase';
import type { CVProfile, CVVersion } from '../types/cv';

export async function saveVersionSnapshot(profile: CVProfile, commitNote = 'Manual Snapshot'): Promise<string> {
  const versionId = `v-${Date.now()}`;
  const { versionHistory: _, ...snapshotData } = profile;

  const versionRecord: CVVersion & { profileId: string } = {
    versionId,
    profileId: profile.id,
    timestamp: Date.now(),
    commitNote,
    dataSnapshot: snapshotData,
  };

  await db.versions.add(versionRecord);
  return versionId;
}

export async function getProfileVersions(profileId: string): Promise<(CVVersion & { profileId: string })[]> {
  return await db.versions.where('profileId').equals(profileId).reverse().sortBy('timestamp');
}

export async function restoreVersionSnapshot(
  version: CVVersion & { profileId: string }
): Promise<CVProfile> {
  const restoredProfile: CVProfile = {
    ...version.dataSnapshot,
    updatedAt: Date.now(),
  };

  await db.profiles.put(restoredProfile);
  return restoredProfile;
}
