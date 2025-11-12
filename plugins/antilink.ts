import { Plugin, PluginContext } from '@roidev/kachina-md';
import { setAntilink, getGroupSettings } from '../utils/database.js';

export default {
  name: 'antilink',
  category: 'group',
  description: 'Mengatur fitur anti link grup WhatsApp',
  commands: ['antilink', 'antilinkgc'],

  async exec({ m, args }: PluginContext) {
    // Check if in group
    if (!m.isGroup) {
      return m.reply('❌ Command ini hanya bisa digunakan di grup!');
    }

    const groupId = m.chat;

    // If no arguments, show current settings
    if (args.length === 0) {
      const settings = await getGroupSettings(groupId);
      const enabled = settings?.antilink?.enabled ? '✅ Aktif' : '❌ Nonaktif';
      const action = settings?.antilink?.action || 'delete';

      let actionText = '';
      switch (action) {
        case 'delete':
          actionText = '🗑️ Hapus pesan';
          break;
        case 'warn':
          actionText = '⚠️ Peringatan (3x kick)';
          break;
        case 'kick':
          actionText = '❌ Kick langsung';
          break;
      }

      return m.reply(
        `*🔗 PENGATURAN ANTILINK*\n\n` +
        `Status: ${enabled}\n` +
        `Aksi: ${actionText}\n\n` +
        `*Cara Penggunaan:*\n` +
        `• \`.antilink on\` - Aktifkan antilink (hapus pesan)\n` +
        `• \`.antilink off\` - Matikan antilink\n` +
        `• \`.antilink warn\` - Mode peringatan (3x kick)\n` +
        `• \`.antilink kick\` - Kick langsung\n` +
        `• \`.antilink delete\` - Hapus pesan saja\n\n` +
        `*Catatan:*\n` +
        `Fitur ini akan mendeteksi dan menghapus link grup WhatsApp:\n` +
        `• chat.whatsapp.com/xxx\n` +
        `• wa.me/xxx\n` +
        `• whatsapp.com/channel/xxx`
      );
    }

    const command = args[0].toLowerCase();

    // Toggle antilink on/off
    if (command === 'on') {
      await setAntilink(groupId, true, 'delete');
      return m.reply(
        '✅ *Antilink berhasil diaktifkan!*\n\n' +
        'Mode: Hapus pesan\n' +
        'Link grup WhatsApp akan otomatis dihapus.'
      );
    }

    if (command === 'off') {
      await setAntilink(groupId, false);
      return m.reply('❌ Antilink berhasil dimatikan!');
    }

    // Set action type
    if (command === 'delete') {
      await setAntilink(groupId, true, 'delete');
      return m.reply(
        '✅ *Antilink mode: Hapus pesan*\n\n' +
        'Pesan yang mengandung link grup akan dihapus.'
      );
    }

    if (command === 'warn') {
      await setAntilink(groupId, true, 'warn');
      return m.reply(
        '✅ *Antilink mode: Peringatan*\n\n' +
        'Member akan mendapat peringatan.\n' +
        'Setelah 3x peringatan akan di-kick otomatis.'
      );
    }

    if (command === 'kick') {
      await setAntilink(groupId, true, 'kick');
      return m.reply(
        '✅ *Antilink mode: Kick*\n\n' +
        '⚠️ Mode keras aktif!\n' +
        'Member yang kirim link grup akan langsung di-kick.'
      );
    }

    return m.reply(
      '❌ Command tidak valid!\n\n' +
      'Gunakan: .antilink on/off/delete/warn/kick'
    );
  }
} satisfies Plugin;
