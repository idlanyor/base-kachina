import { Plugin, PluginContext } from "@roidev/kachina-md";
import { PostAntidonasi } from "../provider/antidonasi.js";

export default {
    name: 'fb-downloader',
    commands: ['fb', 'fbdl','aio'],
    async exec({ m, client, args }: PluginContext) {
        if(!args.length){
            await m.reply('Masukin URL nya cik')
            return
        }
        try {
            await m.react('⬇️')
            const { data } = await PostAntidonasi('/download/video',{ url: args[0] })
            await m.react('😎')
            // await client.sendText(m.chat, `*${data.title} - ${data.author}* \n\n_Video Sedang Dikirim, sabar ya kids_`, { quoted: m })
            await client.sendVideo(m.chat, data.url,data.title)
        } catch (error) {
            m.reply('gagal download cik')
            m.react('😩')
            throw error
        }
    }

} satisfies Plugin;