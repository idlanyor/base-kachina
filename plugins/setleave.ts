import { Plugin, PluginContext } from '@antidonasi/kachina';
import { setLeaveMessage, toggleLeave, getGroupSettings, getDefaultLeaveMessage } from '../utils/database.js';

export default {
  name: 'setleave',
  category: 'group',
  description: 'Mengatur pesan leave untuk member yang keluar',
  commands: ['setleave', 'setl'],

  async exec({ m, args }: PluginContext) {
    // Check if in group
    if (!m.isGroup) {
      return m.reply('❌ Command ini hanya bisa digunakan di grup!');
    }

    const groupId = m.chat;

    // If no arguments, show current settings
    if (args.length === 0) {
      const settings = await getGroupSettings(groupId);
      const leaveMsg = settings?.leave?.message || getDefaultLeaveMessage();
      const status = settings?.leave?.enabled ? '✅ Aktif' : '❌ Nonaktif';

      return m.reply(
        `*👋 PENGATURAN LEAVE*\n\n` +
        `Status: ${status}\n\n` +
        `Pesan saat ini:\n${leaveMsg}\n\n` +
        `*Cara Penggunaan:*\n` +
        `• \`.setleave on\` - Aktifkan leave\n` +
        `• \`.setleave off\` - Matikan leave\n` +
        `• \`.setleave [pesan]\` - Atur pesan leave\n\n` +
        `*Tips:*\n` +
        `• Gunakan @user untuk mention member yang keluar\n` +
        `• Gunakan @name untuk nama member\n` +
        `• Gunakan \\n untuk baris baru`
      );
    }

    const command = args[0].toLowerCase();

    // Toggle leave on/off
    if (command === 'on') {
      await toggleLeave(groupId, true);
      return m.reply('✅ Leave berhasil diaktifkan!');
    }

    if (command === 'off') {
      await toggleLeave(groupId, false);
      return m.reply('❌ Leave berhasil dimatikan!');
    }

    // Set leave message
    const message = args.join(' ');
    if (message.length < 3) {
      return m.reply('❌ Pesan terlalu pendek! Minimal 3 karakter.');
    }

    if (message.length > 500) {
      return m.reply('❌ Pesan terlalu panjang! Maksimal 500 karakter.');
    }

    await setLeaveMessage(groupId, message);

    return m.reply(
      `✅ *Pesan leave berhasil diatur!*\n\n` +
      `Preview:\n${message}\n\n` +
      `Gunakan \`.setleave on\` untuk mengaktifkan.`
    );
  }
} satisfies Plugin;
