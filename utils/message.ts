import { SerializedMessage } from "@roidev/kachina-md";
import { react, Emoji } from "./react";

/**
 * Message Helper untuk WhatsApp Bot
 * Mempermudah pengiriman pesan standar dengan format yang konsisten
 */

// ==================== MESSAGE TYPES ====================

export interface MessageOptions {
  /** React emoji sebelum kirim pesan (optional). Set false untuk disable react */
  react?: string | false;
  /** Quote/reply message (default: true) */
  quote?: boolean;
  /** Mention users (array of JIDs) */
  mentions?: string[];
}

// ==================== MESSAGE BUILDERS ====================

/**
 * Send loading/waiting message
 */
export async function sendLoading(
  m: SerializedMessage,
  message: string = 'Mohon tunggu...',
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.LOADING);
  }
  await m.reply(`⏳ *LOADING*\n\n${message}`);
}

/**
 * Send success message
 */
export async function sendSuccess(
  m: SerializedMessage,
  message: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.SUCCESS);
  }
  await m.reply(`✅ *SUKSES*\n\n${message}`);
}

/**
 * Send error message
 */
export async function sendError(
  m: SerializedMessage,
  message: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\n${message}`);
}

/**
 * Send warning message
 */
export async function sendWarning(
  m: SerializedMessage,
  message: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.WARNING);
  }
  await m.reply(`⚠️ *PERHATIAN*\n\n${message}`);
}

/**
 * Send info message
 */
export async function sendInfo(
  m: SerializedMessage,
  message: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.INFO);
  }
  await m.reply(`ℹ️ *INFO*\n\n${message}`);
}

/**
 * Send processing message
 */
export async function sendProcessing(
  m: SerializedMessage,
  message: string = 'Sedang diproses...',
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.HOURGLASS);
  }
  await m.reply(`⏳ *PROCESSING*\n\n${message}`);
}

/**
 * Send wait message with custom time
 */
export async function sendWait(
  m: SerializedMessage,
  seconds?: number,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.CLOCK);
  }
  const time = seconds ? ` (±${seconds} detik)` : '';
  await m.reply(`⏰ Tunggu sebentar${time}...`);
}

/**
 * Send downloading message
 */
export async function sendDownloading(
  m: SerializedMessage,
  filename?: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.DOWNLOAD);
  }
  const file = filename ? `\n\nFile: ${filename}` : '';
  await m.reply(`⬇️ *DOWNLOADING*${file}\n\nMohon tunggu...`);
}

/**
 * Send uploading message
 */
export async function sendUploading(
  m: SerializedMessage,
  filename?: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.UPLOAD);
  }
  const file = filename ? `\n\nFile: ${filename}` : '';
  await m.reply(`⬆️ *UPLOADING*${file}\n\nMohon tunggu...`);
}

// ==================== VALIDATION MESSAGES ====================

/**
 * Send invalid usage message
 */
export async function sendInvalidUsage(
  m: SerializedMessage,
  command: string,
  usage: string,
  example?: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.WARNING);
  }

  let message = `❌ *PENGGUNAAN SALAH*\n\n`;
  message += `Cara pakai: ${usage}\n`;
  if (example) {
    message += `\nContoh: ${example}`;
  }

  await m.reply(message);
}

/**
 * Send missing argument message
 */
export async function sendMissingArg(
  m: SerializedMessage,
  argName: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nParameter "${argName}" tidak ditemukan!`);
}

/**
 * Send invalid URL message
 */
export async function sendInvalidUrl(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nURL tidak valid!\n\nPastikan URL dimulai dengan http:// atau https://`);
}

/**
 * Send no media message
 */
export async function sendNoMedia(
  m: SerializedMessage,
  mediaType: string = 'gambar/video',
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nKirim atau reply ${mediaType} terlebih dahulu!`);
}

// ==================== PERMISSION MESSAGES ====================

/**
 * Send owner only message
 */
export async function sendOwnerOnly(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.LOCK);
  }
  await m.reply(`🔒 *AKSES DITOLAK*\n\nPerintah ini hanya untuk owner!`);
}

/**
 * Send admin only message
 */
export async function sendAdminOnly(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.LOCK);
  }
  await m.reply(`🔒 *AKSES DITOLAK*\n\nPerintah ini hanya untuk admin grup!`);
}

/**
 * Send group only message
 */
export async function sendGroupOnly(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nPerintah ini hanya bisa digunakan di grup!`);
}

/**
 * Send private only message
 */
export async function sendPrivateOnly(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nPerintah ini hanya bisa digunakan di private chat!`);
}

/**
 * Send bot admin required message
 */
export async function sendBotNotAdmin(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *ERROR*\n\nBot harus menjadi admin grup untuk menggunakan perintah ini!`);
}

// ==================== STATUS MESSAGES ====================

/**
 * Send maintenance message
 */
export async function sendMaintenance(
  m: SerializedMessage,
  feature?: string,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.WARNING);
  }
  const feat = feature ? ` ${feature}` : '';
  await m.reply(`⚠️ *MAINTENANCE*\n\nFitur${feat} sedang dalam perbaikan.\n\nMohon coba lagi nanti.`);
}

/**
 * Send not found message
 */
export async function sendNotFound(
  m: SerializedMessage,
  item: string = 'Data',
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *NOT FOUND*\n\n${item} tidak ditemukan!`);
}

/**
 * Send timeout message
 */
export async function sendTimeout(
  m: SerializedMessage,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.ERROR);
  }
  await m.reply(`❌ *TIMEOUT*\n\nProses melebihi batas waktu.\n\nSilakan coba lagi.`);
}

/**
 * Send rate limit message
 */
export async function sendRateLimit(
  m: SerializedMessage,
  waitTime?: number,
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.WARNING);
  }
  const wait = waitTime ? `\n\nTunggu ${waitTime} detik sebelum mencoba lagi.` : '';
  await m.reply(`⚠️ *RATE LIMIT*\n\nAnda terlalu banyak melakukan request.${wait}`);
}

// ==================== PROGRESS MESSAGES ====================

/**
 * Send progress message with percentage
 */
export async function sendProgress(
  m: SerializedMessage,
  percentage: number,
  status: string = 'Downloading',
  options?: MessageOptions
): Promise<void> {
  if (options?.react !== false) {
    await react(m, options?.react || Emoji.LOADING);
  }

  const bar = createProgressBar(percentage);
  await m.reply(`⏳ *${status.toUpperCase()}*\n\n${bar}\n${percentage}%`);
}

/**
 * Create progress bar string
 */
function createProgressBar(percentage: number, length: number = 10): string {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// ==================== FORMAT HELPERS ====================

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format duration to human readable
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date = new Date()): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mai', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
}

/**
 * Format uptime to human readable
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (secs > 0) parts.push(`${secs} detik`);

  return parts.join(', ') || '0 detik';
}

// ==================== COMBINED HELPERS ====================

/**
 * Process with loading and result message
 */
export async function processWithMessage<T>(
  m: SerializedMessage,
  loadingMsg: string,
  callback: () => Promise<T>,
  options?: {
    successMsg?: string | ((result: T) => string);
    errorMsg?: string | ((error: Error) => string);
    loadingReact?: string;
    successReact?: string;
    errorReact?: string;
  }
): Promise<T> {
  // Send loading message
  await sendLoading(m, loadingMsg, { react: options?.loadingReact });

  try {
    // Execute callback
    const result = await callback();

    // Send success message
    if (options?.successMsg) {
      const msg = typeof options.successMsg === 'function'
        ? options.successMsg(result)
        : options.successMsg;
      await sendSuccess(m, msg, { react: options?.successReact });
    }

    return result;
  } catch (error: any) {
    // Send error message
    const msg = options?.errorMsg
      ? typeof options.errorMsg === 'function'
        ? options.errorMsg(error)
        : options.errorMsg
      : error.message;

    await sendError(m, msg, { react: options?.errorReact });
    throw error;
  }
}

/**
 * Quick message presets
 */
export const QuickMessage = {
  loading: (m: SerializedMessage, msg?: string) => sendLoading(m, msg),
  success: (m: SerializedMessage, msg: string) => sendSuccess(m, msg),
  error: (m: SerializedMessage, msg: string) => sendError(m, msg),
  warning: (m: SerializedMessage, msg: string) => sendWarning(m, msg),
  info: (m: SerializedMessage, msg: string) => sendInfo(m, msg),
  wait: (m: SerializedMessage, seconds?: number) => sendWait(m, seconds),
  downloading: (m: SerializedMessage, filename?: string) => sendDownloading(m, filename),
  uploading: (m: SerializedMessage, filename?: string) => sendUploading(m, filename),
  notFound: (m: SerializedMessage, item?: string) => sendNotFound(m, item),
  ownerOnly: (m: SerializedMessage) => sendOwnerOnly(m),
  adminOnly: (m: SerializedMessage) => sendAdminOnly(m),
  groupOnly: (m: SerializedMessage) => sendGroupOnly(m),
  privateOnly: (m: SerializedMessage) => sendPrivateOnly(m),
  maintenance: (m: SerializedMessage, feature?: string) => sendMaintenance(m, feature),
  timeout: (m: SerializedMessage) => sendTimeout(m),
  rateLimit: (m: SerializedMessage, waitTime?: number) => sendRateLimit(m, waitTime),
};

// ==================== EXPORT ALL ====================

export default {
  // Message senders
  sendLoading,
  sendSuccess,
  sendError,
  sendWarning,
  sendInfo,
  sendProcessing,
  sendWait,
  sendDownloading,
  sendUploading,

  // Validation
  sendInvalidUsage,
  sendMissingArg,
  sendInvalidUrl,
  sendNoMedia,

  // Permissions
  sendOwnerOnly,
  sendAdminOnly,
  sendGroupOnly,
  sendPrivateOnly,
  sendBotNotAdmin,

  // Status
  sendMaintenance,
  sendNotFound,
  sendTimeout,
  sendRateLimit,
  sendProgress,

  // Format helpers
  formatFileSize,
  formatDuration,
  formatNumber,
  formatDate,
  formatUptime,

  // Combined
  processWithMessage,
  QuickMessage,
};
