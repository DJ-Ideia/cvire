import { db } from './cvDatabase';

let cachedCryptoKey: CryptoKey | null = null;

async function getOrCreateCryptoKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) return cachedCryptoKey;

  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  cachedCryptoKey = key;
  return key;
}

export async function saveEncryptedAPIKey(provider: 'gemini' | 'openai', plainKey: string): Promise<void> {
  const cryptoKey = await getOrCreateCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedKey = new TextEncoder().encode(plainKey);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedKey
  );

  await db.encryptedKeys.put({
    provider,
    encryptedKey: encryptedBuffer,
    iv,
    updatedAt: Date.now(),
  });
}

export async function getDecryptedAPIKey(provider: 'gemini' | 'openai'): Promise<string | null> {
  const record = await db.encryptedKeys.get(provider);
  if (!record || !cachedCryptoKey) return null;

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(record.iv) },
      cachedCryptoKey,
      record.encryptedKey
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    return null;
  }
}
