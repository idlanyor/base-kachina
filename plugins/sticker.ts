import { Plugin, PluginContext } from "@antidonasi/kachina";

export default {
  name: 'sticker',
  category: 'converter',
  description: 'Mengubah gambar/video menjadi sticker',
  commands: ['s', 'stiker'],

  async exec({ m, client }: PluginContext) {
    try {
      let mediaMessage = null;

      if (m.quoted) {
        const quotedType = m.quoted.type;
        if (quotedType === 'imageMessage' || quotedType === 'videoMessage') {
          mediaMessage = m.quoted;
        }
      }

      if (!mediaMessage) {
        if (m.type === 'imageMessage' || m.type === 'videoMessage') {
          mediaMessage = m;
        }
      }

      if (!mediaMessage) {
        return await m.reply('❌ Kirim/reply gambar atau video dengan caption !sticker');
      }

      await m.reply('⏳ Membuat sticker...');

      const media = await mediaMessage.download();

      if (!media) {
        return await m.reply('❌ Gagal mendownload media');
      }

      await client.sendSticker(m.chat, media);

    } catch (error) {
      console.error('Error membuat sticker:', error);
      await m.reply('❌ Gagal membuat sticker. Pastikan file adalah gambar atau video.');
    }
  }
} satisfies Plugin;
