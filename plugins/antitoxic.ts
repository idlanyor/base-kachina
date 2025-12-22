import { Plugin, PluginContext } from '@antidonasi/kachina';
import { setAntitoxic, getGroupSettings, addToxicWord, removeToxicWord } from '../utils/database.js';

export default {
  name: 'antitoxic',
  category: 'group',
  description: 'Mengatur fitur anti kata-kata toxic',
  commands: ['antitoxic', 'antitoxic', 'antikasar'],

  async exec({ m, args }: PluginContext) {
    // Check if in group
    if (!m.isGroup) {
      return m.reply('❌ Command ini hanya bisa digunakan di grup!');
    }

    const groupId = m.chat;

    // If no arguments, show current settings
    if (args.length === 0) {
      const settings = await getGroupSettings(groupId);
      const enabled = settings?.antitoxic?.enabled ? '✅ Aktif' : '❌ Nonaktif';
      const action = settings?.antitoxic?.action || 'delete';
      const customWords = settings?.antitoxic?.customWords || [];

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

      let customWordsText = '';
      if (customWords.length > 0) {
        customWordsText = `\n\n*Kata Custom (${customWords.length}):*\n${customWords.map(w => `• ${w}`).join('\n')}`;
      }

      return m.reply(
        `*🚫 PENGATURAN ANTITOXIC*\n\n` +
        `Status: ${enabled}\n` +
        `Aksi: ${actionText}${customWordsText}\n\n` +
        `*Cara Penggunaan:*\n` +
        `• \`.antitoxic on\` - Aktifkan antitoxic (hapus)\n` +
        `• \`.antitoxic off\` - Matikan antitoxic\n` +
        `• \`.antitoxic warn\` - Mode peringatan (3x kick)\n` +
        `• \`.antitoxic kick\` - Kick langsung\n` +
        `• \`.antitoxic delete\` - Hapus pesan saja\n` +
        `• \`.antitoxic add [kata]\` - Tambah kata toxic custom\n` +
        `• \`.antitoxic remove [kata]\` - Hapus kata custom\n\n` +
        `*Catatan:*\n` +
        `Bot sudah punya database kata toxic default.\n` +
        `Kamu bisa tambah kata custom sesuai kebutuhan grup.`
      );
    }

    const command = args[0].toLowerCase();

    // Toggle antitoxic on/off
    if (command === 'on') {
      await setAntitoxic(groupId, true, 'delete');
      return m.reply(
        '✅ *Antitoxic berhasil diaktifkan!*\n\n' +
        'Mode: Hapus pesan\n' +
        'Kata-kata toxic akan otomatis dihapus.'
      );
    }

    if (command === 'off') {
      await setAntitoxic(groupId, false);
      return m.reply('❌ Antitoxic berhasil dimatikan!');
    }

    // Set action type
    if (command === 'delete') {
      await setAntitoxic(groupId, true, 'delete');
      return m.reply(
        '✅ *Antitoxic mode: Hapus pesan*\n\n' +
        'Pesan toxic akan dihapus.'
      );
    }

    if (command === 'warn') {
      await setAntitoxic(groupId, true, 'warn');
      return m.reply(
        '✅ *Antitoxic mode: Peringatan*\n\n' +
        'Member akan mendapat peringatan.\n' +
        'Setelah 3x peringatan akan di-kick otomatis.'
      );
    }

    if (command === 'kick') {
      await setAntitoxic(groupId, true, 'kick');
      return m.reply(
        '✅ *Antitoxic mode: Kick*\n\n' +
        '⚠️ Mode keras aktif!\n' +
        'Member yang toxic akan langsung di-kick.'
      );
    }

    // Add custom toxic word
    if (command === 'add') {
      if (args.length < 2) {
        return m.reply('❌ Masukkan kata yang ingin ditambahkan!\n\nContoh: .antitoxic add kontol');
      }

      const word = args.slice(1).join(' ').toLowerCase();
      await addToxicWord(groupId, word);

      return m.reply(
        `✅ *Kata toxic berhasil ditambahkan!*\n\n` +
        `Kata: "${word}"\n` +
        `Kata ini akan terdeteksi sebagai toxic di grup ini.`
      );
    }

    // Remove custom toxic word
    if (command === 'remove' || command === 'del' || command === 'delete') {
      if (args.length < 2) {
        return m.reply('❌ Masukkan kata yang ingin dihapus!\n\nContoh: .antitoxic remove kontol');
      }

      const word = args.slice(1).join(' ').toLowerCase();
      await removeToxicWord(groupId, word);

      return m.reply(
        `✅ *Kata toxic berhasil dihapus!*\n\n` +
        `Kata: "${word}"\n` +
        `Kata ini tidak lagi terdeteksi sebagai toxic custom.`
      );
    }

    return m.reply(
      '❌ Command tidak valid!\n\n' +
      'Gunakan: .antitoxic on/off/delete/warn/kick/add/remove'
    );
  }
} satisfies Plugin;
