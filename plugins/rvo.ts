import { Plugin, PluginContext } from "@roidev/kachina-md";

export default {
  name: 'rvo',
  category: 'converter',
  description: 'Membaca view once message',
  commands: ['rvo'],

  async exec({ m, client }: PluginContext) {
    try {
      await m.react('⏳');
      if (m.quoted?.type === 'viewOnceMessageV2' || m.quoted?.type === 'viewOnceMessage') {
        await client.sendViewOnce(m.chat, m.quoted);
        await m.react('✅');
      }

    } catch (error) {
      console.error('Error membaca view once message:', error);
      await m.reply('Gagal membaca view once message. Pastikan file adalah view once message.');
    }
  }
} satisfies Plugin;
