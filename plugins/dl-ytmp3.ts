import { Plugin, PluginContext } from "@antidonasi/kachina";
import { getRyzumi } from "../provider/ryzumi.js";
export default {
    name: 'ytmp3',
    commands: ['ytmp3'],
    description: 'Download audio Youtube',
    category: 'downloader',
    async exec({ client, m, args, prefix }: PluginContext) {
        if (!args.length) {
            await m.reply('Masukin URL nya cik')
            return
        }
        try {
            await m.react('👌')
            const { data } = await getRyzumi('/api/downloader/ytmp3', { url: args[0] })
            await m.react('😎')
            await client.sendText(m.chat, `*${data.title} - ${data.author}* \n\n_Audio Sedang Dikirim, sabar ya kids_`, { quoted: m })
            await client.sendAudio(m.chat, data.url, { quoted: m })
        } catch (error) {
            m.reply('gagal download cik')
            m.react('😩')
            throw error
        }

    }

} satisfies Plugin