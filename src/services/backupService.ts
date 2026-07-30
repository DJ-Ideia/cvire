import { db } from '../db/cvDatabase';
import { CVProfile } from '../types/cv';
import { useCVStore } from '../store/useCVStore';

/**
 * Export all resumes stored in IndexedDB into a single formatted JSON backup file.
 */
export async function exportAllResumesJSON(): Promise<void> {
  const profiles = await db.profiles.toArray();
  if (!profiles || profiles.length === 0) {
    alert('No resumes found to export.');
    return;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `cvire-backup-${dateStr}.json`;

  const jsonStr = JSON.stringify(profiles, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a single resume profile into a formatted JSON file.
 */
export function exportSingleResumeJSON(profile: CVProfile): void {
  const cleanTitle = (profile.title || 'resume').toLowerCase().replace(/\s+/g, '-');
  const filename = `${cleanTitle}.json`;

  const jsonStr = JSON.stringify([profile], null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import resumes from an uploaded JSON file and merge them into IndexedDB.
 */
export async function importResumesJSON(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          throw new Error('File content is empty.');
        }

        const parsed = JSON.parse(text);
        let profilesToImport: CVProfile[] = [];

        if (Array.isArray(parsed)) {
          profilesToImport = parsed;
        } else if (parsed && typeof parsed === 'object' && parsed.id) {
          profilesToImport = [parsed as CVProfile];
        } else {
          throw new Error('Invalid JSON format: Expected a single resume or an array of resumes.');
        }

        // Validate basic profile structure
        const validProfiles = profilesToImport.filter(
          (p) => p && typeof p === 'object' && p.id && p.personal
        );

        if (validProfiles.length === 0) {
          throw new Error('No valid cvire resumes found in the JSON file.');
        }

        // Save into Dexie IndexedDB & update store
        const { importProfiles } = useCVStore.getState();
        await importProfiles(validProfiles);

        resolve(validProfiles.length);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsText(file);
  });
}
