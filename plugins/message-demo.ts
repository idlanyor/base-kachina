import { Plugin, PluginContext } from "@roidev/kachina-md";
import {
  sendLoading,
  sendSuccess,
  sendError,
  sendWarning,
  sendInfo,
  sendDownloading,
  sendInvalidUsage,
  sendOwnerOnly,
  sendAdminOnly,
  sendGroupOnly,
  sendTimeout,
  sendRateLimit,
  sendProgress,
  formatFileSize,
  formatDuration,
  formatNumber,
  formatDate,
  formatUptime,
  QuickMessage,
  processWithMessage
} from "../utils/message";
import { QuickReact } from "../utils/react";

export default {
  name: 'message-demo',
  commands: ['msgdemo', 'md'],
  category: 'general',
  description: 'Demo penggunaan message helper',

  async exec({ m, args, prefix, command }: PluginContext) {
    const usage = `📖 *MESSAGE DEMO - USAGE*

Pilih mode demo:
1️⃣ ${prefix}${command} basic - Basic Messages
2️⃣ ${prefix}${command} validation - Validation Messages
3️⃣ ${prefix}${command} permission - Permission Messages
4️⃣ ${prefix}${command} status - Status Messages
5️⃣ ${prefix}${command} format - Format Helpers
6️⃣ ${prefix}${command} quick - Quick Messages
7️⃣ ${prefix}${command} process - Process With Message

Contoh: ${prefix}${command} basic`;

    if (!args.length) {
      await QuickReact.info(m);
      return await m.reply(usage);
    }

    const mode = args[0].toLowerCase();

    switch (mode) {
      case 'basic':
        await demoBasicMessages(m);
        break;

      case 'validation':
        await demoValidationMessages(m, prefix, command);
        break;

      case 'permission':
        await demoPermissionMessages(m);
        break;

      case 'status':
        await demoStatusMessages(m);
        break;

      case 'format':
        await demoFormatHelpers(m);
        break;

      case 'quick':
        await demoQuickMessages(m);
        break;

      case 'process':
        await demoProcessWithMessage(m);
        break;

      default:
        await QuickReact.warning(m);
        await m.reply(usage);
    }
  }
} satisfies Plugin;

// ============ DEMO FUNCTIONS ============

async function demoBasicMessages(m: any) {
  await m.reply('📨 *BASIC MESSAGES DEMO*\n\nPerhatikan format pesannya...\n');

  await new Promise(r => setTimeout(r, 1500));
  await sendLoading(m, 'Memproses data...');

  await new Promise(r => setTimeout(r, 2000));
  await sendSuccess(m, 'Data berhasil diproses!');

  await new Promise(r => setTimeout(r, 1500));
  await sendError(m, 'Terjadi kesalahan saat memproses!');

  await new Promise(r => setTimeout(r, 1500));
  await sendWarning(m, 'File terlalu besar, mungkin memakan waktu lama!');

  await new Promise(r => setTimeout(r, 1500));
  await sendInfo(m, 'Bot versi 2.0 telah dirilis!');

  await new Promise(r => setTimeout(r, 1500));
  await sendDownloading(m, 'video.mp4');

  await new Promise(r => setTimeout(r, 1500));
  await m.reply('✅ Demo basic messages selesai!');
}

async function demoValidationMessages(m: any, prefix: string, command: string) {
  await m.reply('✔️ *VALIDATION MESSAGES DEMO*\n\nPesan validasi standar...\n');

  await new Promise(r => setTimeout(r, 1500));
  await sendInvalidUsage(
    m,
    'ytmp3',
    `${prefix}ytmp3 <url>`,
    `${prefix}ytmp3 https://youtube.com/watch?v=xxx`
  );

  await new Promise(r => setTimeout(r, 2000));
  await m.reply('⬆️ *Contoh: Invalid Usage*\n\n' +
    'Digunakan ketika user salah menggunakan command.');

  await new Promise(r => setTimeout(r, 1500));
  await m.reply('✅ Demo validation messages selesai!\n\n' +
    'Lihat dokumentasi untuk validation lainnya:\n' +
    '- sendMissingArg()\n' +
    '- sendInvalidUrl()\n' +
    '- sendNoMedia()');
}

async function demoPermissionMessages(m: any) {
  await m.reply('🔒 *PERMISSION MESSAGES DEMO*\n\nPesan permission/akses...\n');

  await new Promise(r => setTimeout(r, 1500));
  await sendOwnerOnly(m);

  await new Promise(r => setTimeout(r, 2000));
  await sendAdminOnly(m);

  await new Promise(r => setTimeout(r, 2000));
  await sendGroupOnly(m);

  await new Promise(r => setTimeout(r, 1500));
  await m.reply('✅ Demo permission messages selesai!');
}

async function demoStatusMessages(m: any) {
  await m.reply('📊 *STATUS MESSAGES DEMO*\n\nPesan status dan error...\n');

  await new Promise(r => setTimeout(r, 1500));
  await sendTimeout(m);

  await new Promise(r => setTimeout(r, 2000));
  await sendRateLimit(m, 60);

  await new Promise(r => setTimeout(r, 2000));

  // Progress demo
  await m.reply('📈 *Progress Demo*\n');
  for (let i = 0; i <= 100; i += 25) {
    await sendProgress(m, i, 'Downloading');
    await new Promise(r => setTimeout(r, 1000));
  }

  await new Promise(r => setTimeout(r, 1000));
  await m.reply('✅ Demo status messages selesai!');
}

async function demoFormatHelpers(m: any) {
  await m.reply('🔧 *FORMAT HELPERS DEMO*\n\nFormat number, size, duration, etc...\n');

  await new Promise(r => setTimeout(r, 1500));

  const demo = `📊 *Format Examples:*

*File Size:*
${formatFileSize(1024)} (1KB)
${formatFileSize(1048576)} (1MB)
${formatFileSize(2500000)} (2.5MB)

*Duration:*
${formatDuration(125)} (2:05)
${formatDuration(3665)} (1:01:05)

*Number:*
${formatNumber(1000000)} (1 juta)
${formatNumber(1234567)} (1.2 juta)

*Date:*
${formatDate()}

*Uptime:*
${formatUptime(process.uptime())}

✅ Semua helper otomatis format dengan konsisten!`;

  await m.reply(demo);
}

async function demoQuickMessages(m: any) {
  await m.reply('⚡ *QUICK MESSAGES DEMO*\n\nPesan cepat dengan QuickMessage...\n');

  await new Promise(r => setTimeout(r, 1500));
  await QuickMessage.loading(m, 'Processing...');

  await new Promise(r => setTimeout(r, 1500));
  await QuickMessage.success(m, 'Berhasil!');

  await new Promise(r => setTimeout(r, 1500));
  await QuickMessage.error(m, 'Gagal!');

  await new Promise(r => setTimeout(r, 1500));
  await QuickMessage.downloading(m, 'file.mp4');

  await new Promise(r => setTimeout(r, 1500));
  await m.reply('✅ Demo quick messages selesai!\n\n' +
    'QuickMessage mempermudah kirim pesan tanpa banyak import!');
}

async function demoProcessWithMessage(m: any) {
  await m.reply('⚙️ *PROCESS WITH MESSAGE DEMO*\n\nOtomatis loading → success/error...\n');

  await new Promise(r => setTimeout(r, 1500));

  // Success scenario
  try {
    await processWithMessage(
      m,
      'Mengunduh file...',
      async () => {
        // Simulate download
        await new Promise(r => setTimeout(r, 2000));
        return { size: 2500000, name: 'video.mp4' };
      },
      {
        successMsg: (result: any) =>
          `File "${result.name}" berhasil diunduh!\nSize: ${formatFileSize(result.size)}`
      }
    );
  } catch (error) {
    // Auto handled
  }

  await new Promise(r => setTimeout(r, 2000));

  // Error scenario
  try {
    await processWithMessage(
      m,
      'Memproses data...',
      async () => {
        // Simulate error
        await new Promise(r => setTimeout(r, 1500));
        throw new Error('Koneksi terputus');
      },
      {
        errorMsg: (error: Error) => `Gagal memproses: ${error.message}`
      }
    );
  } catch (error) {
    // Auto handled
  }

  await new Promise(r => setTimeout(r, 1500));
  await m.reply('✅ Demo process with message selesai!\n\n' +
    'processWithMessage() otomatis handle loading, success, dan error!');
}
