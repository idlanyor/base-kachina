import { Plugin, PluginContext } from "@roidev/kachina-md";
import { QuickReact } from "../utils/react";
import { formatUptime } from "../utils/message";

export default {
  name: 'button-menu',
  commands: ['bmenu', 'buttonmenu'],
  category: 'general',
  description: 'Menu navigasi dengan button interaktif',

  async exec({ m, client, prefix }: PluginContext) {
    try {
      await showMainMenu(m, client, prefix);
    } catch (error: any) {
      await QuickReact.error(m);
      await m.reply(`❌ Error: ${error.message}`);
      console.error('Button menu error:', error);
    }
  }
} satisfies Plugin;

// ============ MENU FUNCTIONS ============

/**
 * Main menu dengan template buttons
 */
async function showMainMenu(m: any, client: any, prefix: string) {
  await QuickReact.loading(m);

  const uptime = formatUptime(process.uptime());
  const ownerList = Array.isArray(client.config.owner)
    ? client.config.owner.join(', ')
    : client.config.owner;

  const menuText = `╭━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *KACHINA BOT MENU*
┃━━━━━━━━━━━━━━━━━━━━
┃
┃ 👤 Owner: ${ownerList}
┃ 🔧 Prefix: ${prefix}
┃ ⏱️ Uptime: ${uptime}
┃ 📱 Platform: WhatsApp
┃
╰━━━━━━━━━━━━━━━━━━━━

Pilih kategori menu dengan button di bawah:`;

  const sections = [
    {
      title: '📋 Menu Utama',
      rows: [
        {
          title: '📖 Semua Perintah',
          rowId: 'menu_all_commands',
          description: 'Lihat semua perintah yang tersedia'
        },
        {
          title: '👤 Profil Bot',
          rowId: 'menu_bot_info',
          description: 'Informasi lengkap tentang bot'
        },
        {
          title: '❓ Bantuan',
          rowId: 'menu_help',
          description: 'Cara menggunakan bot'
        }
      ]
    },
    {
      title: '🎮 Kategori Fitur',
      rows: [
        {
          title: '⬇️ Downloader',
          rowId: 'menu_downloader',
          description: 'Download video, musik, dll'
        },
        {
          title: '🎉 Hiburan',
          rowId: 'menu_fun',
          description: 'Game, quote, motivasi, dll'
        },
        {
          title: '👥 Grup Manager',
          rowId: 'menu_group',
          description: 'Kelola grup WhatsApp'
        },
        {
          title: '🔧 Tools & Utilities',
          rowId: 'menu_tools',
          description: 'Berbagai tools berguna'
        }
      ]
    },
    {
      title: '👑 Owner Menu',
      rows: [
        {
          title: '⚙️ Pengaturan Bot',
          rowId: 'menu_settings',
          description: 'Konfigurasi bot (Owner only)'
        },
        {
          title: '📊 Statistik',
          rowId: 'menu_stats',
          description: 'Lihat statistik bot (Owner only)'
        }
      ]
    }
  ];

  await client.sendListMessage(
    m.chat,
    '🎯 Klik untuk memilih menu',
    {
      text: menuText,
      footer: 'Powered by @roidev/kachina-md v2.3.0',
      buttonText: '📱 Buka Menu',
      sections
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Menu konfirmasi aksi dengan buttons
 */
export async function showConfirmation(
  m: any,
  client: any,
  action: string,
  description: string,
  confirmId: string,
  cancelId: string
) {
  const buttons = [
    {
      buttonId: confirmId,
      buttonText: { displayText: '✅ Ya, Lanjutkan' },
      type: 1
    },
    {
      buttonId: cancelId,
      buttonText: { displayText: '❌ Batal' },
      type: 1
    }
  ];

  const confirmText = `⚠️ *KONFIRMASI ${action.toUpperCase()}*

${description}

Apakah kamu yakin ingin melanjutkan?`;

  await client.sendButtonMessage(
    m.chat,
    confirmText,
    buttons,
    {
      footer: 'Pilih salah satu opsi',
      quoted: m
    }
  );
}

/**
 * Menu quick actions dengan template buttons
 */
export async function showQuickActions(m: any, client: any, prefix: string) {
  const templateButtons = [
    {
      index: 1,
      quickReplyButton: {
        displayText: '📋 Menu',
        id: 'quick_menu'
      }
    },
    {
      index: 2,
      quickReplyButton: {
        displayText: '🎲 Random',
        id: 'quick_random'
      }
    },
    {
      index: 3,
      quickReplyButton: {
        displayText: 'ℹ️ Info',
        id: 'quick_info'
      }
    }
  ];

  await client.sendTemplateButtons(
    m.chat,
    templateButtons,
    {
      text: '⚡ *QUICK ACTIONS*\n\nAkses cepat ke fitur-fitur utama bot!',
      footer: `Ketik ${prefix}help untuk bantuan`
    },
    {
      quoted: m
    }
  );
}

/**
 * Menu dengan gambar dan buttons
 */
export async function showMediaMenu(m: any, client: any) {
  const templateButtons = [
    {
      index: 1,
      quickReplyButton: {
        displayText: '🖼️ Gambar',
        id: 'media_image'
      }
    },
    {
      index: 2,
      quickReplyButton: {
        displayText: '🎥 Video',
        id: 'media_video'
      }
    },
    {
      index: 3,
      quickReplyButton: {
        displayText: '🎵 Audio',
        id: 'media_audio'
      }
    },
    {
      index: 4,
      urlButton: {
        displayText: '📚 Gallery',
        url: 'https://example.com/gallery'
      }
    }
  ];

  await client.sendTemplateButtons(
    m.chat,
    templateButtons,
    {
      text: '🎨 *MEDIA MENU*\n\nPilih jenis media yang ingin kamu akses!',
      footer: 'Bot mendukung berbagai format media'
    },
    {
      quoted: m
    }
  );
}
