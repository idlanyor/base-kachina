import { Plugin, PluginContext } from '@roidev/kachina-md';
import { setWelcomeMessage, toggleWelcome, getGroupSettings, getDefaultWelcomeMessage } from '../utils/database.js';

export default {
  name: 'setwelcome',
  category: 'group',
  description: 'Mengatur pesan welcome untuk member baru',
  commands: ['setwelcome', 'setw'],

  async exec({ m, args }: PluginContext) {
    // Check if in group
    if (!m.isGroup) {
      return m.reply('❌ Command ini hanya bisa digunakan di grup!');
    }

    const groupId = m.chat;

    // If no arguments, show current settings
    if (args.length === 0) {
      const settings = await getGroupSettings(groupId);
      const welcomeMsg = settings?.welcome?.message || getDefaultWelcomeMessage();
      const status = settings?.welcome?.enabled ? '✅ Aktif' : '❌ Nonaktif';

      return m.reply(
        `*🎉 PENGATURAN WELCOME*\n\n` +
        `Status: ${status}\n\n` +
        `Pesan saat ini:\n${welcomeMsg}\n\n` +
        `*Cara Penggunaan:*\n` +
        `• \`.setwelcome on\` - Aktifkan welcome\n` +
        `• \`.setwelcome off\` - Matikan welcome\n` +
        `• \`.setwelcome [pesan]\` - Atur pesan welcome\n\n` +
        `*Tips:*\n` +
        `• Gunakan @user untuk mention member baru\n` +
        `• Gunakan @name untuk nama member\n` +
        `• Gunakan \\n untuk baris baru`
      );
    }

    const command = args[0].toLowerCase();

    // Toggle welcome on/off
    if (command === 'on') {
      await toggleWelcome(groupId, true);
      return m.reply('✅ Welcome berhasil diaktifkan!');
    }

    if (command === 'off') {
      await toggleWelcome(groupId, false);
      return m.reply('❌ Welcome berhasil dimatikan!');
    }

    // Set welcome message
    const message = args.join(' ');
    if (message.length < 3) {
      return m.reply('❌ Pesan terlalu pendek! Minimal 3 karakter.');
    }

    if (message.length > 500) {
      return m.reply('❌ Pesan terlalu panjang! Maksimal 500 karakter.');
    }

    await setWelcomeMessage(groupId, message);

    return m.reply(
      `✅ *Pesan welcome berhasil diatur!*\n\n` +
      `Preview:\n${message}\n\n` +
      `Gunakan \`.setwelcome on\` untuk mengaktifkan.`
    );
  }
} satisfies Plugin;
