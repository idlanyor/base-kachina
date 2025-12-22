import { Client, ClientOptions } from '@antidonasi/kachina';
import dotenv from 'dotenv';
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  initDatabase,
  getGroupSettings,
  formatMessage,
  containsGroupLink,
  containsToxicWords,
  addWarning
} from './utils/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plugins path - must load from dist/plugins (compiled JS)
// Library @antidonasi/kachina only supports .js files for plugins
const pluginsPath = __dirname.endsWith('dist')
  ? path.join(__dirname, 'plugins')
  : path.join(__dirname, 'dist', 'plugins');

// Konfigurasi bot
const bot = new Client({
  sessionId: process.env.SESSION_ID || 'kachina-session',
  loginMethod:'pairing',
  phoneNumber:'6282134216100',
  prefix: process.env.PREFIX || '!',
  owner: process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.split(',') : ['628xxx'],
} as ClientOptions);

// Event: Bot siap digunakan
bot.on('ready', async (user: any) => {
  console.log('✅ Bot berhasil terhubung!');
  console.log('📱 ID:', user.id);
  console.log('👤 Nama:', user.pushName || 'WhatsApp Bot');
  console.log('🔧 Prefix:', (bot as any).prefix);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Initialize database
  await initDatabase();

  // Load plugins after bot is ready
  console.log('📦 Loading plugins from:', pluginsPath);
  await bot.loadPlugins(pluginsPath);
});

// Event: Pesan masuk
bot.on('message', async (m: any) => {
  console.log(m.body);

  // Only process group messages for antilink & antitoxic
  if (m.isGroup) {
    try {
      const groupId = m.chat;
      const settings = await getGroupSettings(groupId);

      if (!settings) return;

      const messageText = m.body || '';

      // ===== ANTILINK DETECTION =====
      if (settings.antilink?.enabled && containsGroupLink(messageText)) {
        const action = settings.antilink.action || 'delete';

        // Delete message
        await m.delete();

        if (action === 'warn') {
          const warnings = await addWarning(groupId, m.sender);
          await m.reply(
            `⚠️ @${m.sender.split('@')[0]} jangan kirim link grup!\n\n` +
            `Peringatan: ${warnings}/3\n` +
            `Jika mencapai 3 peringatan akan di-kick!`,
            { mentions: [m.sender] }
          );

          // Auto kick after 3 warnings
          if (warnings >= 3) {
            await (bot as any).groupParticipantsUpdate(groupId, [m.sender], 'remove');
            await (bot as any).sendMessage(groupId, {
              text: `❌ @${m.sender.split('@')[0]} telah di-kick karena melanggar aturan grup!`,
              mentions: [m.sender]
            });
          }
        } else if (action === 'kick') {
          await (bot as any).groupParticipantsUpdate(groupId, [m.sender], 'remove');
          await (bot as any).sendMessage(groupId, {
            text: `❌ @${m.sender.split('@')[0]} telah di-kick karena mengirim link grup!`,
            mentions: [m.sender]
          });
        } else {
          // Just delete (default)
          await m.reply(
            `🚫 Link grup terdeteksi!\n@${m.sender.split('@')[0]}, pesan kamu telah dihapus.`,
            { mentions: [m.sender] }
          );
        }
        return; // Stop processing
      }

      // ===== ANTITOXIC DETECTION =====
      if (settings.antitoxic?.enabled && containsToxicWords(messageText, settings.antitoxic.customWords)) {
        const action = settings.antitoxic.action || 'delete';

        // Delete message
        await m.delete();

        if (action === 'warn') {
          const warnings = await addWarning(groupId, m.sender);
          await m.reply(
            `⚠️ @${m.sender.split('@')[0]} jaga ucapan kamu!\n\n` +
            `Peringatan: ${warnings}/3\n` +
            `Jika mencapai 3 peringatan akan di-kick!`,
            { mentions: [m.sender] }
          );

          // Auto kick after 3 warnings
          if (warnings >= 3) {
            await (bot as any).groupParticipantsUpdate(groupId, [m.sender], 'remove');
            await (bot as any).sendMessage(groupId, {
              text: `❌ @${m.sender.split('@')[0]} telah di-kick karena toxic berulang kali!`,
              mentions: [m.sender]
            });
          }
        } else if (action === 'kick') {
          await (bot as any).groupParticipantsUpdate(groupId, [m.sender], 'remove');
          await (bot as any).sendMessage(groupId, {
            text: `❌ @${m.sender.split('@')[0]} telah di-kick karena toxic!`,
            mentions: [m.sender]
          });
        } else {
          // Just delete (default)
          await m.reply(
            `🚫 Kata-kata toxic terdeteksi!\n@${m.sender.split('@')[0]}, jaga ucapan kamu.`,
            { mentions: [m.sender] }
          );
        }
        return; // Stop processing
      }
    } catch (error) {
      console.error('Error in antilink/antitoxic handler:', error);
    }
  }

  // Handler sederhana untuk pesan non-command
  if (m.body === 'ping') {
    await m.reply('Pong! 🏓');
  }
});

// Event: Koneksi ulang
bot.on('reconnecting', () => {
  console.log('🔄 Mencoba menyambung kembali...');
});

// Event: Error
(bot as any).on('error', (error: any) => {
  console.error('❌ Error:', error.message);
});

// Event: Group update (untuk welcome & leave)
(bot as any).on('group.update', async (update: any) => {
  console.log('Group update:', update);

  try {
    const { id: groupId, participants, action } = update;

    if (!groupId || !participants || !action) return;

    // Get group settings
    const settings = await getGroupSettings(groupId);
    if (!settings) return;

    // Handle participant add (welcome)
    if (action === 'add' && settings.welcome?.enabled) {
      for (const participant of participants) {
        try {
          // Get participant info
          const userName = participant.split('@')[0];
          const message = formatMessage(settings.welcome.message, userName, participant);

          // Send welcome message with mention
          await (bot as any).sendMessage(groupId, {
            text: message,
            mentions: [participant]
          });
        } catch (err) {
          console.error('Error sending welcome message:', err);
        }
      }
    }

    // Handle participant remove (leave)
    if (action === 'remove' && settings.leave?.enabled) {
      for (const participant of participants) {
        try {
          // Get participant info
          const userName = participant.split('@')[0];
          const message = formatMessage(settings.leave.message, userName, participant);

          // Send leave message with mention
          await (bot as any).sendMessage(groupId, {
            text: message,
            mentions: [participant]
          });
        } catch (err) {
          console.error('Error sending leave message:', err);
        }
      }
    }
  } catch (error) {
    console.error('Error in group.update handler:', error);
  }
});

// Event: QR Code untuk login (jika belum ada sesi)
(bot as any).on('qr', (qr: any) => {
  console.log('📱 Scan QR Code di bawah ini untuk login:');
  console.log(qr);
});

// Jalankan bot
console.log('🚀 Memulai WhatsApp Bot...');
bot.start().catch((error) => {
  console.error('❌ Gagal memulai bot:', error);
  process.exit(1);
});

// Tangani shutdown
process.on('SIGINT', async () => {
  console.log('\n⏸️  Menghentikan bot...');
  process.exit(0);
});
