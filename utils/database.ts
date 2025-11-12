import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== DATABASE TYPES ====================

export interface GroupSettings {
  groupId: string;
  welcome?: {
    enabled: boolean;
    message: string;
  };
  leave?: {
    enabled: boolean;
    message: string;
  };
  antilink?: {
    enabled: boolean;
    action: 'delete' | 'kick' | 'warn';
  };
  antitoxic?: {
    enabled: boolean;
    action: 'delete' | 'kick' | 'warn';
    customWords?: string[];
  };
  warnings?: Record<string, number>; // userId: warningCount
  createdAt: number;
  updatedAt: number;
}

export interface Database {
  groups: Record<string, GroupSettings>;
}

// ==================== DATABASE INSTANCE ====================

// Use process.cwd() to get project root, not __dirname (which points to dist/utils after compilation)
const dbPath = path.join(process.cwd(), 'data', 'database.json');
const adapter = new JSONFile<Database>(dbPath);
const db = new Low<Database>(adapter, { groups: {} });

// Default data
const defaultData: Database = {
  groups: {},
};

// Initialize database
export async function initDatabase(): Promise<void> {
  try {
    await db.read();
    db.data = db.data || defaultData;
    await db.write();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// ==================== GROUP SETTINGS ====================

/**
 * Get group settings
 */
export async function getGroupSettings(groupId: string): Promise<GroupSettings | null> {
  await db.read();
  return db.data?.groups[groupId] || null;
}

/**
 * Create or update group settings
 */
export async function setGroupSettings(
  groupId: string,
  settings: Partial<Omit<GroupSettings, 'groupId' | 'createdAt' | 'updatedAt'>>
): Promise<GroupSettings> {
  await db.read();

  if (!db.data) {
    db.data = defaultData;
  }

  const existing = db.data.groups[groupId];
  const now = Date.now();

  if (existing) {
    // Update existing
    db.data.groups[groupId] = {
      ...existing,
      ...settings,
      updatedAt: now,
    };
  } else {
    // Create new
    db.data.groups[groupId] = {
      groupId,
      welcome: settings.welcome || {
        enabled: false,
        message: 'Welcome @user to the group! 👋',
      },
      leave: settings.leave || {
        enabled: false,
        message: '@user has left the group. 👋',
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  await db.write();
  return db.data.groups[groupId];
}

/**
 * Set welcome message
 */
export async function setWelcomeMessage(groupId: string, message: string): Promise<void> {
  const settings = await getGroupSettings(groupId);

  await setGroupSettings(groupId, {
    welcome: {
      enabled: settings?.welcome?.enabled ?? true,
      message,
    },
  });
}

/**
 * Set leave message
 */
export async function setLeaveMessage(groupId: string, message: string): Promise<void> {
  const settings = await getGroupSettings(groupId);

  await setGroupSettings(groupId, {
    leave: {
      enabled: settings?.leave?.enabled ?? true,
      message,
    },
  });
}

/**
 * Toggle welcome status
 */
export async function toggleWelcome(groupId: string, enabled: boolean): Promise<void> {
  const settings = await getGroupSettings(groupId);

  await setGroupSettings(groupId, {
    welcome: {
      enabled,
      message: settings?.welcome?.message || 'Welcome @user to the group! 👋',
    },
  });
}

/**
 * Toggle leave status
 */
export async function toggleLeave(groupId: string, enabled: boolean): Promise<void> {
  const settings = await getGroupSettings(groupId);

  await setGroupSettings(groupId, {
    leave: {
      enabled,
      message: settings?.leave?.message || '@user has left the group. 👋',
    },
  });
}

/**
 * Get all group settings
 */
export async function getAllGroupSettings(): Promise<Record<string, GroupSettings>> {
  await db.read();
  return db.data?.groups || {};
}

/**
 * Delete group settings
 */
export async function deleteGroupSettings(groupId: string): Promise<void> {
  await db.read();
  if (db.data?.groups[groupId]) {
    delete db.data.groups[groupId];
    await db.write();
  }
}

// ==================== UTILITIES ====================

/**
 * Format welcome/leave message with mentions
 */
export function formatMessage(message: string, userName: string, userJid: string): string {
  return message
    .replace(/@user/g, `@${userJid.split('@')[0]}`)
    .replace(/@name/g, userName)
    .replace(/\\n/g, '\n');
}

/**
 * Get default welcome message
 */
export function getDefaultWelcomeMessage(): string {
  return 'Halo @user! 👋\n\nSelamat datang di grup ini!\nSemoga betah ya~ 😊';
}

/**
 * Get default leave message
 */
export function getDefaultLeaveMessage(): string {
  return 'Goodbye @user 👋\n\nSemoga sukses selalu!';
}

// ==================== ANTILINK ====================

/**
 * Set antilink settings
 */
export async function setAntilink(
  groupId: string,
  enabled: boolean,
  action: 'delete' | 'kick' | 'warn' = 'delete'
): Promise<void> {
  await setGroupSettings(groupId, {
    antilink: { enabled, action }
  });
}

/**
 * Check if message contains WhatsApp group link
 */
export function containsGroupLink(message: string): boolean {
  const linkPatterns = [
    /chat\.whatsapp\.com\/([a-zA-Z0-9]+)/gi,
    /wa\.me\/([a-zA-Z0-9]+)/gi,
    /whatsapp\.com\/channel\/([a-zA-Z0-9]+)/gi,
  ];

  return linkPatterns.some(pattern => pattern.test(message));
}

// ==================== ANTITOXIC ====================

/**
 * Set antitoxic settings
 */
export async function setAntitoxic(
  groupId: string,
  enabled: boolean,
  action: 'delete' | 'kick' | 'warn' = 'delete'
): Promise<void> {
  const settings = await getGroupSettings(groupId);
  await setGroupSettings(groupId, {
    antitoxic: {
      enabled,
      action,
      customWords: settings?.antitoxic?.customWords || []
    }
  });
}

/**
 * Add custom toxic word
 */
export async function addToxicWord(groupId: string, word: string): Promise<void> {
  const settings = await getGroupSettings(groupId);
  const customWords = settings?.antitoxic?.customWords || [];

  if (!customWords.includes(word.toLowerCase())) {
    customWords.push(word.toLowerCase());
    await setGroupSettings(groupId, {
      antitoxic: {
        enabled: settings?.antitoxic?.enabled ?? true,
        action: settings?.antitoxic?.action ?? 'delete',
        customWords
      }
    });
  }
}

/**
 * Remove custom toxic word
 */
export async function removeToxicWord(groupId: string, word: string): Promise<void> {
  const settings = await getGroupSettings(groupId);
  const customWords = settings?.antitoxic?.customWords || [];

  const filtered = customWords.filter(w => w !== word.toLowerCase());
  await setGroupSettings(groupId, {
    antitoxic: {
      enabled: settings?.antitoxic?.enabled ?? true,
      action: settings?.antitoxic?.action ?? 'delete',
      customWords: filtered
    }
  });
}

/**
 * Default toxic words list (Indonesian)
 */
const defaultToxicWords = [
  'anjing', 'anjir', 'asu', 'babi', 'bangsat', 'bajingan', 'bego', 'bodoh',
  'tolol', 'goblok', 'idiot', 'kontol', 'memek', 'ngentot', 'jancok', 'coli',
  'pepek', 'tai', 'bangke', 'monyet', 'kampret', 'kimak', 'kntl', 'mmk',
  'jnck', 'bngst', 'ajg', 'njir', 'fuck', 'bitch', 'shit', 'damn', 'hell',
  'ass', 'bastard', 'cunt', 'dick', 'pussy', 'slut', 'whore'
];

/**
 * Check if message contains toxic words
 */
export function containsToxicWords(message: string, customWords: string[] = []): boolean {
  const allWords = [...defaultToxicWords, ...customWords];
  const lowerMessage = message.toLowerCase();

  return allWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
    return regex.test(lowerMessage);
  });
}

// ==================== WARNINGS ====================

/**
 * Add warning to user
 */
export async function addWarning(groupId: string, userId: string): Promise<number> {
  await db.read();

  if (!db.data) {
    db.data = { groups: {} };
  }

  if (!db.data.groups[groupId]) {
    await setGroupSettings(groupId, {});
  }

  if (!db.data.groups[groupId].warnings) {
    db.data.groups[groupId].warnings = {};
  }

  const currentWarnings = db.data.groups[groupId].warnings![userId] || 0;
  db.data.groups[groupId].warnings![userId] = currentWarnings + 1;

  await db.write();
  return currentWarnings + 1;
}

/**
 * Get user warnings
 */
export async function getWarnings(groupId: string, userId: string): Promise<number> {
  const settings = await getGroupSettings(groupId);
  return settings?.warnings?.[userId] || 0;
}

/**
 * Reset user warnings
 */
export async function resetWarnings(groupId: string, userId: string): Promise<void> {
  await db.read();

  if (db.data?.groups[groupId]?.warnings?.[userId]) {
    delete db.data.groups[groupId].warnings![userId];
    await db.write();
  }
}

// ==================== EXPORT ====================

export default {
  initDatabase,
  getGroupSettings,
  setGroupSettings,
  setWelcomeMessage,
  setLeaveMessage,
  toggleWelcome,
  toggleLeave,
  getAllGroupSettings,
  deleteGroupSettings,
  formatMessage,
  getDefaultWelcomeMessage,
  getDefaultLeaveMessage,
  setAntilink,
  containsGroupLink,
  setAntitoxic,
  addToxicWord,
  removeToxicWord,
  containsToxicWords,
  addWarning,
  getWarnings,
  resetWarnings,
};
