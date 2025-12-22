import { Plugin, PluginContext } from "@antidonasi/kachina";

export default {
  name: 'motivasi',
  category: 'fun',
  description: 'Menampilkan kata-kata motivasi',
  commands:['motivasi'],

  async exec({ m }: PluginContext) {
    const motivations = [
      'Jangan pernah menyerah! Setiap usaha yang kamu lakukan tidak akan sia-sia! 💪',
      'Kamu lebih kuat dari yang kamu pikirkan! Keep fighting! 🔥',
      'Kesuksesan bukan milik orang yang paling pintar, tapi milik orang yang pantang menyerah! 🌟',
      'Hari ini mungkin sulit, tapi kamu pasti bisa melewatinya! 💫',
      'Percaya pada diri sendiri adalah langkah pertama menuju kesuksesan! ✨',
      'Jatuh itu biasa, yang penting bangkit lagi lebih kuat! 🚀',
      'Setiap hari adalah kesempatan baru untuk menjadi lebih baik! 🌈',
      'Kamu tidak sendirian dalam perjalanan ini! Semangat! 🎯'
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

    await m.reply(`*MOTIVASI HARI INI* 🌟\n\n${randomMotivation}`);
  }
} satisfies Plugin;
