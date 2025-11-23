import { Plugin, PluginContext } from "@roidev/kachina-md";
import { QuickReact } from "../utils/react";

export default {
  name: 'button-demo',
  commands: ['button', 'btn'],
  category: 'general',
  description: 'Demo penggunaan button interaktif',

  async exec({ m, args, prefix, command, client }: PluginContext) {
    const usage = `📱 *BUTTON DEMO - USAGE*

Pilih mode demo:
1️⃣ ${prefix}${command} simple - Button Sederhana
2️⃣ ${prefix}${command} list - List Button
3️⃣ ${prefix}${command} template - Template Button
4️⃣ ${prefix}${command} multi - Multiple Buttons
5️⃣ ${prefix}${command} url - URL Button
6️⃣ ${prefix}${command} call - Call Button

Contoh: ${prefix}${command} simple`;

    if (!args.length) {
      await QuickReact.info(m);
      return await m.reply(usage);
    }

    const mode = args[0].toLowerCase();

    try {
      switch (mode) {
        case 'simple':
          await demoSimpleButton(m, client);
          break;

        case 'list':
          await demoListButton(m, client);
          break;

        case 'template':
          await demoTemplateButton(m, client);
          break;

        case 'multi':
          await demoMultiButton(m, client);
          break;

        case 'url':
          await demoUrlButton(m, client);
          break;

        case 'call':
          await demoCallButton(m, client);
          break;

        default:
          await QuickReact.warning(m);
          await m.reply(usage);
      }
    } catch (error: any) {
      await QuickReact.error(m);
      await m.reply(`❌ Error: ${error.message}\n\nPastikan bot mendukung button di platform ini.`);
      console.error('Button demo error:', error);
    }
  }
} satisfies Plugin;

// ============ DEMO FUNCTIONS ============

/**
 * Demo button sederhana
 */
async function demoSimpleButton(m: any, client: any) {
  await QuickReact.loading(m);

  const buttons = [
    {
      buttonId: 'btn1',
      buttonText: { displayText: '✅ Ya' },
      type: 1
    },
    {
      buttonId: 'btn2',
      buttonText: { displayText: '❌ Tidak' },
      type: 1
    }
  ];

  await client.sendButtonMessage(
    m.chat,
    '🔘 *BUTTON SEDERHANA*\n\nApakah kamu suka bot ini?',
    buttons,
    {
      footer: 'Powered by @roidev/kachina-md',
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Demo list button (dropdown)
 */
async function demoListButton(m: any, client: any) {
  await QuickReact.loading(m);

  const sections = [
    {
      title: '📋 Menu Utama',
      rows: [
        {
          title: 'Menu 1',
          rowId: 'menu1',
          description: 'Deskripsi menu 1'
        },
        {
          title: 'Menu 2',
          rowId: 'menu2',
          description: 'Deskripsi menu 2'
        }
      ]
    },
    {
      title: '⚙️ Pengaturan',
      rows: [
        {
          title: 'Pengaturan Bot',
          rowId: 'settings1',
          description: 'Konfigurasi bot'
        },
        {
          title: 'Tentang Bot',
          rowId: 'about',
          description: 'Info tentang bot'
        }
      ]
    }
  ];

  await client.sendListMessage(
    m.chat,
    '📝 Klik tombol di bawah',
    {
      text: '🎯 *LIST BUTTON DEMO*\n\nPilih salah satu menu dari list!',
      footer: 'Powered by @roidev/kachina-md',
      buttonText: 'Pilih Menu',
      sections
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Demo template button
 */
async function demoTemplateButton(m: any, client: any) {
  await QuickReact.loading(m);

  const templateButtons = [
    {
      index: 1,
      quickReplyButton: {
        displayText: '🏠 Menu',
        id: 'menu_home'
      }
    },
    {
      index: 2,
      quickReplyButton: {
        displayText: 'ℹ️ Info',
        id: 'info_bot'
      }
    },
    {
      index: 3,
      quickReplyButton: {
        displayText: '⚙️ Settings',
        id: 'settings_bot'
      }
    }
  ];

  await client.sendTemplateButtons(
    m.chat,
    templateButtons,
    {
      text: '🎨 *TEMPLATE BUTTON DEMO*\n\nTemplate button dengan quick reply!',
      footer: 'Powered by @roidev/kachina-md'
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Demo multiple buttons
 */
async function demoMultiButton(m: any, client: any) {
  await QuickReact.loading(m);

  const buttons = [
    {
      buttonId: 'opt1',
      buttonText: { displayText: '1️⃣ Opsi 1' },
      type: 1
    },
    {
      buttonId: 'opt2',
      buttonText: { displayText: '2️⃣ Opsi 2' },
      type: 1
    },
    {
      buttonId: 'opt3',
      buttonText: { displayText: '3️⃣ Opsi 3' },
      type: 1
    },
    {
      buttonId: 'opt4',
      buttonText: { displayText: '4️⃣ Opsi 4' },
      type: 1
    }
  ];

  await client.sendButtonMessage(
    m.chat,
    '🔢 *MULTIPLE BUTTONS DEMO*\n\nPilih salah satu opsi di bawah ini:',
    buttons,
    {
      footer: 'Kamu bisa pilih lebih dari satu button',
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Demo URL button
 */
async function demoUrlButton(m: any, client: any) {
  await QuickReact.loading(m);

  const templateButtons = [
    {
      index: 1,
      urlButton: {
        displayText: '📚 Documentation',
        url: 'https://kachina-core.antidonasi.web.id/'
      }
    },
    {
      index: 2,
      urlButton: {
        displayText: '💻 GitHub',
        url: 'https://github.com/idlanyor/kachina-core'
      }
    },
    {
      index: 3,
      quickReplyButton: {
        displayText: '🔙 Kembali',
        id: 'back_menu'
      }
    }
  ];

  await client.sendTemplateButtons(
    m.chat,
    templateButtons,
    {
      text: '🔗 *URL BUTTON DEMO*\n\nButton dengan link eksternal!',
      footer: 'Klik button untuk membuka website'
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}

/**
 * Demo call button
 */
async function demoCallButton(m: any, client: any) {
  await QuickReact.loading(m);

  const templateButtons = [
    {
      index: 1,
      callButton: {
        displayText: '📞 Call Support',
        phoneNumber: '+62 821-3421-6100'
      }
    },
    {
      index: 2,
      quickReplyButton: {
        displayText: '💬 Chat Support',
        id: 'chat_support'
      }
    },
    {
      index: 3,
      quickReplyButton: {
        displayText: '🔙 Kembali',
        id: 'back_menu'
      }
    }
  ];

  await client.sendTemplateButtons(
    m.chat,
    templateButtons,
    {
      text: '📱 *CALL BUTTON DEMO*\n\nButton untuk melakukan panggilan telepon!',
      footer: 'Klik untuk menghubungi support'
    },
    {
      quoted: m
    }
  );

  await QuickReact.success(m);
}
