import { Plugin, PluginContext } from "@roidev/kachina-md";
import {
  Emoji,
  QuickReact,
  sequentialReact,
  processReact,
  createProgressReact,
  reactWithDelay
} from "../utils/react";

export default {
  name: 'react-demo',
  commands: ['reactdemo', 'rd'],
  category: 'general',
  description: 'Demo penggunaan react helper',

  async exec({ m, args, prefix, command }: PluginContext) {
    const usage = `📖 *REACT DEMO - USAGE*

Pilih mode demo:
1️⃣ ${prefix}${command} quick - Quick React Presets
2️⃣ ${prefix}${command} sequential - Sequential React
3️⃣ ${prefix}${command} process - Process React
4️⃣ ${prefix}${command} progress - Progress React
5️⃣ ${prefix}${command} delay - React with Delay

Contoh: ${prefix}${command} quick`;

    if (!args.length) {
      await QuickReact.info(m);
      return await m.reply(usage);
    }

    const mode = args[0].toLowerCase();

    switch (mode) {
      case 'quick':
        await demoQuickReact(m);
        break;

      case 'sequential':
        await demoSequentialReact(m);
        break;

      case 'process':
        await demoProcessReact(m);
        break;

      case 'progress':
        await demoProgressReact(m);
        break;

      case 'delay':
        await demoDelayReact(m);
        break;

      default:
        await QuickReact.warning(m);
        await m.reply(usage);
    }
  }
} satisfies Plugin;

// ============ DEMO FUNCTIONS ============

async function demoQuickReact(m: any) {
  await m.reply('🚀 *QUICK REACT DEMO*\n\nPerhatikan perubahan emoji...');

  await new Promise(r => setTimeout(r, 1000));
  await QuickReact.loading(m);
  await m.reply('⏳ Loading...');

  await new Promise(r => setTimeout(r, 1500));
  await QuickReact.success(m);
  await m.reply('✅ Success!');

  await new Promise(r => setTimeout(r, 1000));
  await QuickReact.fire(m);
  await m.reply('🔥 Fire!');

  await new Promise(r => setTimeout(r, 1000));
  await QuickReact.rocket(m);
  await m.reply('🚀 Rocket!');
}

async function demoSequentialReact(m: any) {
  await m.reply('📽️ *SEQUENTIAL REACT DEMO*\n\nEmoji akan berubah secara berurutan...');

  await new Promise(r => setTimeout(r, 1000));

  await sequentialReact(m, [
    Emoji.SEARCH,
    Emoji.DOWNLOAD,
    Emoji.SAVE,
    Emoji.SUCCESS
  ], 800);

  await m.reply('✅ Sequential react selesai!');
}

async function demoProcessReact(m: any) {
  await m.reply('⚙️ *PROCESS REACT DEMO*\n\nLoading → Success/Error otomatis...');

  await new Promise(r => setTimeout(r, 1000));

  try {
    await processReact(m, async () => {
      // Simulate async work
      await new Promise(r => setTimeout(r, 2000));

      await m.reply('✅ Process berhasil! Emoji otomatis berubah dari ⏳ ke ✅');
    }, {
      loading: Emoji.LOADING,
      success: Emoji.PARTY,
      error: Emoji.ERROR
    });
  } catch (error: any) {
    await m.reply(`❌ Error: ${error.message}`);
  }
}

async function demoProgressReact(m: any) {
  await m.reply('📊 *PROGRESS REACT DEMO*\n\nMulti-step process dengan emoji indicator...');

  await new Promise(r => setTimeout(r, 1000));

  const updateProgress = createProgressReact(m);

  await updateProgress(Emoji.SEARCH);
  await m.reply('🔍 Step 1: Searching data...');
  await new Promise(r => setTimeout(r, 1500));

  await updateProgress(Emoji.DOWNLOAD);
  await m.reply('⬇️ Step 2: Downloading...');
  await new Promise(r => setTimeout(r, 1500));

  await updateProgress(Emoji.UPLOAD);
  await m.reply('⬆️ Step 3: Uploading...');
  await new Promise(r => setTimeout(r, 1500));

  await updateProgress(Emoji.SUCCESS);
  await m.reply('✅ All steps completed!');
}

async function demoDelayReact(m: any) {
  await m.reply('⏱️ *REACT WITH DELAY DEMO*\n\nReact setelah 3 detik...');

  await reactWithDelay(m, Emoji.ROCKET, 3000);

  await m.reply('🚀 React muncul setelah 3 detik!');
}
