import Dexie, { Table } from 'dexie';
import { CVProfile, CVVersion } from '../types/cv';
import { demoProfiles } from '../data/initialData';

export interface EncryptedKeyRecord {
  provider: 'gemini' | 'openai';
  encryptedKey: ArrayBuffer;
  iv: Uint8Array;
  updatedAt: number;
}

export class CVDatabase extends Dexie {
  profiles!: Table<CVProfile, string>;
  versions!: Table<CVVersion & { profileId: string }, string>;
  encryptedKeys!: Table<EncryptedKeyRecord, string>;

  constructor() {
    super('CVBuilderProDB');

    this.version(1).stores({
      profiles: 'id, title, language, isFavorite, isArchived, updatedAt',
      versions: 'versionId, profileId, timestamp',
      encryptedKeys: 'provider, updatedAt',
    });
  }
}

export const db = new CVDatabase();

/**
 * Initialize database with default seed profiles on first startup if empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  const count = await db.profiles.count();
  if (count === 0) {
    await db.profiles.bulkAdd(demoProfiles);
  }
}
