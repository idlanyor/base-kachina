import { SerializedMessage } from "@roidev/kachina-md";

/**
 * React Emoji Helper untuk WhatsApp Bot
 * Mempermudah penggunaan react emoji di berbagai plugin
 */

// ==================== EMOJI CONSTANTS ====================

export const Emoji = {
  // Status
  LOADING: '⏳',
  SUCCESS: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',

  // Process
  HOURGLASS: '⏳',
  CLOCK: '⏰',
  TIMER: '⏱️',
  STOPWATCH: '⏲️',

  // Emotions
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  FIRE: '🔥',
  HEART: '❤️',
  STAR: '⭐',
  SPARKLES: '✨',
  PARTY: '🎉',
  ROCKET: '🚀',

  // Actions
  SEARCH: '🔍',
  DOWNLOAD: '⬇️',
  UPLOAD: '⬆️',
  REFRESH: '🔄',
  DELETE: '🗑️',
  EDIT: '✏️',
  SAVE: '💾',

  // Symbols
  CHECK: '✔️',
  CROSS: '✖️',
  QUESTION: '❓',
  EXCLAMATION: '❗',
  PLUS: '➕',
  MINUS: '➖',

  // Others
  THINKING: '🤔',
  EYES: '👀',
  ROBOT: '🤖',
  COMPUTER: '💻',
  BOOK: '📖',
  LOCK: '🔒',
  UNLOCK: '🔓',
  KEY: '🔑',
} as const;

// Type for Emoji values
export type EmojiType = typeof Emoji[keyof typeof Emoji];

// ==================== HELPER FUNCTIONS ====================

/**
 * React ke message dengan emoji
 * @param m - SerializedMessage object
 * @param emoji - Emoji string atau dari Emoji constant
 * @returns Promise<void>
 */
export async function react(m: SerializedMessage, emoji: string): Promise<void> {
  try {
    await m.react(emoji);
  } catch (error) {
    console.error('Failed to react:', error);
  }
}

/**
 * React ke message dengan delay
 * @param m - SerializedMessage object
 * @param emoji - Emoji string
 * @param delayMs - Delay dalam milliseconds (default: 1000ms)
 * @returns Promise<void>
 */
export async function reactWithDelay(
  m: SerializedMessage,
  emoji: string,
  delayMs: number = 1000
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  await react(m, emoji);
}

/**
 * Sequential react - menampilkan emoji secara berurutan
 * @param m - SerializedMessage object
 * @param emojis - Array of emoji strings
 * @param delayMs - Delay antara setiap emoji (default: 500ms)
 * @returns Promise<void>
 */
export async function sequentialReact(
  m: SerializedMessage,
  emojis: string[],
  delayMs: number = 500
): Promise<void> {
  for (const emoji of emojis) {
    await react(m, emoji);
    if (emojis.indexOf(emoji) < emojis.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Process react - menampilkan loading, kemudian success atau error
 * @param m - SerializedMessage object
 * @param callback - Async function yang akan dijalankan
 * @param options - Options untuk customisasi emoji
 * @returns Promise<T> - Return value dari callback
 */
export async function processReact<T>(
  m: SerializedMessage,
  callback: () => Promise<T>,
  options?: {
    loading?: string;
    success?: string;
    error?: string;
    showLoading?: boolean;
  }
): Promise<T> {
  const {
    loading = Emoji.LOADING,
    success = Emoji.SUCCESS,
    error = Emoji.ERROR,
    showLoading = true,
  } = options || {};

  try {
    // Show loading
    if (showLoading) {
      await react(m, loading);
    }

    // Execute callback
    const result = await callback();

    // Show success
    await react(m, success);

    return result;
  } catch (err) {
    // Show error
    await react(m, error);
    throw err;
  }
}

/**
 * React dengan progress - untuk multi-step process
 * Usage: const updateProgress = createProgressReact(m);
 *        await updateProgress(Emoji.LOADING);
 *        // ... do something ...
 *        await updateProgress(Emoji.SUCCESS);
 */
export function createProgressReact(m: SerializedMessage) {
  return async (emoji: string) => {
    await react(m, emoji);
  };
}

/**
 * Quick react presets untuk common scenarios
 */
export const QuickReact = {
  loading: async (m: SerializedMessage) => await react(m, Emoji.LOADING),
  success: async (m: SerializedMessage) => await react(m, Emoji.SUCCESS),
  error: async (m: SerializedMessage) => await react(m, Emoji.ERROR),
  warning: async (m: SerializedMessage) => await react(m, Emoji.WARNING),
  info: async (m: SerializedMessage) => await react(m, Emoji.INFO),
  thinking: async (m: SerializedMessage) => await react(m, Emoji.THINKING),
  fire: async (m: SerializedMessage) => await react(m, Emoji.FIRE),
  rocket: async (m: SerializedMessage) => await react(m, Emoji.ROCKET),
};

/**
 * Remove react (react dengan emoji kosong)
 * @param m - SerializedMessage object
 * @returns Promise<void>
 */
export async function removeReact(m: SerializedMessage): Promise<void> {
  try {
    await m.react('');
  } catch (error) {
    console.error('Failed to remove react:', error);
  }
}

// ==================== EXPORT ALL ====================

export default {
  Emoji,
  react,
  reactWithDelay,
  sequentialReact,
  processReact,
  createProgressReact,
  QuickReact,
  removeReact,
};
