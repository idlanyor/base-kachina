import { Plugin, PluginContext } from "@antidonasi/kachina";

export default {
  name: 'quote',
  category: 'fun',
  description: 'Menampilkan quote random',
  commands: ['quotes'],

  async exec({ m }: PluginContext) {
    const quotes = [
      { text: 'Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.', author: 'Colin Powell' },
      { text: 'Jangan menunggu. Tidak akan pernah ada waktu yang tepat.', author: 'Napoleon Hill' },
      { text: 'Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.', author: 'Peter Drucker' },
      { text: 'Kegagalan adalah kesuksesan yang tertunda.', author: 'Unknown' },
      { text: 'Bermimpilah seolah kamu akan hidup selamanya. Hiduplah seolah kamu akan mati hari ini.', author: 'James Dean' },
      { text: 'Yang penting bukanlah seberapa keras kamu jatuh, tapi seberapa cepat kamu bangkit.', author: 'Unknown' },
      { text: 'Kesempatan tidak datang, kamu harus menciptakannya.', author: 'Chris Grosser' },
      { text: 'Jangan biarkan kemarin menghabiskan terlalu banyak hari ini.', author: 'Will Rogers' }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const quoteText = `
╭─────────────────
│ 💭 *QUOTE OF THE DAY*
│ ━━━━━━━━━━━━━━━
│ "${randomQuote.text}"
│
│ — ${randomQuote.author}
╰─────────────────
    `.trim();

    await m.reply(quoteText);
  }
} satisfies Plugin;
