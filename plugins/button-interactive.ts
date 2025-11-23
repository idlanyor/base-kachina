import { Plugin, PluginContext } from "@roidev/kachina-md";
import { QuickReact } from "../utils/react";

export default {
  name: 'button-interactive',
  commands: ['quiz', 'poll', 'survey'],
  category: 'fun',
  description: 'Demo button interaktif dengan response handling',

  async exec({ m, client, command }: PluginContext) {
    try {
      if (command === 'quiz') {
        await startQuiz(m, client);
      } else if (command === 'poll') {
        await startPoll(m, client);
      } else if (command === 'survey') {
        await startSurvey(m, client);
      }
    } catch (error: any) {
      await QuickReact.error(m);
      await m.reply(`❌ Error: ${error.message}`);
      console.error('Interactive button error:', error);
    }
  }
} satisfies Plugin;

// ============ INTERACTIVE FUNCTIONS ============

/**
 * Quiz interaktif dengan button
 */
async function startQuiz(m: any, client: any) {
  await QuickReact.loading(m);

  const buttons = [
    {
      buttonId: 'quiz_a',
      buttonText: { displayText: 'A. JavaScript' },
      type: 1
    },
    {
      buttonId: 'quiz_b',
      buttonText: { displayText: 'B. Python' },
      type: 1
    },
    {
      buttonId: 'quiz_c',
      buttonText: { displayText: 'C. TypeScript' },
      type: 1
    },
    {
      buttonId: 'quiz_d',
      buttonText: { displayText: 'D. Java' },
      type: 1
    }
  ];

  const quizText = `🎯 *QUIZ TIME!*

❓ Pertanyaan:
Bahasa pemrograman apa yang digunakan untuk mengembangkan bot kachina-md?

💡 Pilih jawaban yang benar:`;

  await client.sendButtonMessage(
    m.chat,
    quizText,
    buttons,
    {
      footer: 'Pilih salah satu jawaban',
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Polling dengan button
 */
async function startPoll(m: any, client: any) {
  await QuickReact.loading(m);

  const buttons = [
    {
      buttonId: 'poll_very_good',
      buttonText: { displayText: '⭐⭐⭐⭐⭐ Sangat Bagus' },
      type: 1
    },
    {
      buttonId: 'poll_good',
      buttonText: { displayText: '⭐⭐⭐⭐ Bagus' },
      type: 1
    },
    {
      buttonId: 'poll_ok',
      buttonText: { displayText: '⭐⭐⭐ Cukup' },
      type: 1
    },
    {
      buttonId: 'poll_bad',
      buttonText: { displayText: '⭐⭐ Kurang' },
      type: 1
    }
  ];

  const pollText = `📊 *POLLING*

Bagaimana pengalaman kamu menggunakan bot ini?

Silahkan berikan rating:`;

  await client.sendButtonMessage(
    m.chat,
    pollText,
    buttons,
    {
      footer: 'Terima kasih atas feedback kamu!',
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Survey dengan list button
 */
async function startSurvey(m: any, client: any) {
  await QuickReact.loading(m);

  const sections = [
    {
      title: '🎮 Kategori Fitur',
      rows: [
        {
          title: 'Downloader',
          rowId: 'survey_downloader',
          description: 'Fitur download media'
        },
        {
          title: 'Games & Fun',
          rowId: 'survey_games',
          description: 'Fitur hiburan dan permainan'
        },
        {
          title: 'Grup Manager',
          rowId: 'survey_group',
          description: 'Fitur manajemen grup'
        },
        {
          title: 'AI & Tools',
          rowId: 'survey_ai',
          description: 'Fitur AI dan tools'
        }
      ]
    },
    {
      title: '📈 Tingkat Kepuasan',
      rows: [
        {
          title: 'Sangat Puas',
          rowId: 'survey_rating_5',
          description: '⭐⭐⭐⭐⭐'
        },
        {
          title: 'Puas',
          rowId: 'survey_rating_4',
          description: '⭐⭐⭐⭐'
        },
        {
          title: 'Cukup Puas',
          rowId: 'survey_rating_3',
          description: '⭐⭐⭐'
        }
      ]
    }
  ];

  await client.sendListMessage(
    m.chat,
    '📋 Klik untuk memilih',
    {
      text: `📝 *SURVEY BOT*

Fitur apa yang paling kamu suka?

Bantu kami meningkatkan layanan dengan mengisi survey singkat ini!`,
      footer: 'Terima kasih atas partisipasi kamu',
      buttonText: '📊 Pilih Kategori',
      sections
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}
