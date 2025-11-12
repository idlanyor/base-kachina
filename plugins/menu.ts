import Client, { Plugin, PluginContext } from "@roidev/kachina-md";
import { formatUptime } from "../utils/message";
import { QuickReact } from "../utils/react";

export default {
  name: 'menu',
  commands: ['menu', 'help', 'list'],
  category: 'general',
  description: 'Menampilkan daftar perintah yang tersedia',

  async exec({ m, client, prefix, args }: PluginContext) {
    // Show plugin info if specific command requested
    if (args[0]) {
      return await showPluginInfo(m, client, prefix, args[0]);
    }

    await QuickReact.loading(m);

    try {
      // Get all loaded plugins
      const plugins = await getLoadedPlugins(client);

      // Group plugins by category
      const groupedPlugins = groupPluginsByCategory(plugins);

      // Build menu text
      const menuText = buildMenuText(client, prefix, groupedPlugins, plugins.length);

      await QuickReact.success(m);
      await m.reply(menuText);

    } catch (error: any) {
      await QuickReact.error(m);
      await m.reply(`❌ Error: ${error.message}`);
    }
  }
} satisfies Plugin;

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all loaded plugins from client
 */
function getLoadedPlugins(client: Client): any[] {
  let plugins: any[] = [];

  try {
    // Framework kachina-md stores plugins in client.pluginHandler.plugins
    if (client.pluginHandler && client.pluginHandler.plugins) {
      const pluginStore = client.pluginHandler.plugins;
      console.log('[MENU] pluginStore type:', pluginStore?.constructor?.name);
      console.log('[MENU] pluginStore instanceof Map:', pluginStore instanceof Map);

      // Check if it's a Map
      if (pluginStore instanceof Map) {
        plugins = Array.from(pluginStore.values());
        console.log('[MENU] Found plugins (Map):', plugins.length);
      }
      // Check if it's an Array
      else if (Array.isArray(pluginStore)) {
        plugins = pluginStore;
        console.log('[MENU] Found plugins (Array):', plugins.length);
      }
      // Check if it's a plain object
      else if (typeof pluginStore === 'object') {
        plugins = Object.values(pluginStore);
        console.log('[MENU] Found plugins (Object):', plugins.length);
      }
    }
    // Fallback: try other possible locations
    else if ((client as any).handler?.plugins) {
      const pluginStore = (client as any).handler.plugins;
      if (pluginStore instanceof Map) {
        plugins = Array.from(pluginStore.values());
      } else if (Array.isArray(pluginStore)) {
        plugins = pluginStore;
      } else {
        plugins = Object.values(pluginStore);
      }
    }
    // Fallback: try direct plugins property
    else if ((client as any).plugins) {
      const pluginStore = (client as any).plugins;
      if (pluginStore instanceof Map) {
        plugins = Array.from(pluginStore.values());
      } else if (Array.isArray(pluginStore)) {
        plugins = pluginStore;
      } else {
        plugins = Object.values(pluginStore);
      }
    }
  } catch (error) {
    console.error('Error getting plugins:', error);
  }

  // Filter out invalid plugins
  return plugins.filter(p => p && p.name && p.commands);
}

/**
 * Group plugins by category
 */
function groupPluginsByCategory(plugins: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};

  for (const plugin of plugins) {
    const category = plugin.category || 'uncategorized';

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(plugin);
  }

  // Sort plugins within each category
  for (const category in grouped) {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  return grouped;
}

/**
 * Build menu text
 */
function buildMenuText(
  client: any,
  prefix: string,
  groupedPlugins: Record<string, any[]>,
  totalPlugins: number
): string {
  const ownerList = Array.isArray(client.config.owner)
    ? client.config.owner.join(', ')
    : client.config.owner;

  const uptime = formatUptime(process.uptime());

  // Header
  let menu = `
╭━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *WHATSAPP BOT MENU*
┃━━━━━━━━━━━━━━━━━━━━
┃ 👤 Owner: ${ownerList}
┃ 🔧 Prefix: ${prefix}
┃ 📦 Plugins: ${totalPlugins}
┃ ⏱️ Uptime: ${uptime}
╰━━━━━━━━━━━━━━━━━━━━

`;

  // Category mapping for icons
  const categoryIcons: Record<string, string> = {
    general: '📋',
    owner: '👑',
    group: '👥',
    downloader: '⬇️',
    fun: '🎉',
    tools: '🔧',
    uncategorized: '📌',
  };

  // Category names in Indonesian
  const categoryNames: Record<string, string> = {
    general: 'UMUM',
    owner: 'OWNER',
    group: 'GRUP',
    downloader: 'DOWNLOADER',
    fun: 'HIBURAN',
    tools: 'TOOLS',
    uncategorized: 'LAINNYA',
  };

  // Sort categories (owner first, then alphabetically)
  const sortedCategories = Object.keys(groupedPlugins).sort((a, b) => {
    if (a === 'owner') return -1;
    if (b === 'owner') return 1;
    if (a === 'general') return -1;
    if (b === 'general') return 1;
    return a.localeCompare(b);
  });

  // Build menu for each category
  for (const category of sortedCategories) {
    const plugins = groupedPlugins[category];
    const icon = categoryIcons[category] || '📌';
    const name = categoryNames[category] || category.toUpperCase();

    menu += `╭━━━━━━━━━━━━━━━━━━━━\n`;
    menu += `┃ ${icon} *${name}*\n`;
    menu += `┃━━━━━━━━━━━━━━━━━━━━\n`;

    for (const plugin of plugins) {
      // Get first command as the primary command
      const command = Array.isArray(plugin.commands)
        ? plugin.commands[0]
        : plugin.commands;

      const desc = plugin.description || 'No description';

      // Add owner indicator
      const ownerBadge = plugin.owner ? '👑 ' : '';

      menu += `┃ ${ownerBadge}${prefix}${command}\n`;
      menu += `┃   └ ${desc}\n`;
    }

    menu += `╰━━━━━━━━━━━━━━━━━━━━\n\n`;
  }

  // Footer
  menu += `💡 *Info:*\n`;
  menu += `• Kirim ${prefix}<command> untuk menggunakan\n`;
  menu += `• Kirim ${prefix}menu <command> untuk detail\n`;
  menu += `• 👑 = Command khusus owner\n`;

  return menu.trim();
}

/**
 * Show detailed info about a specific plugin
 */
async function showPluginInfo(
  m: any,
  client: any,
  prefix: string,
  commandName: string
): Promise<void> {
  await QuickReact.loading(m);

  const plugins = await getLoadedPlugins(client);

  // Find plugin by command name
  const plugin = plugins.find((p) => {
    if (!p.commands) return false;

    const commands = Array.isArray(p.commands) ? p.commands : [p.commands];
    return commands.includes(commandName);
  });

  if (!plugin) {
    await QuickReact.error(m);
    return await m.reply(
      `❌ *Plugin tidak ditemukan!*\n\nCommand "${commandName}" tidak ada.\n\nGunakan ${prefix}menu untuk melihat daftar command.`
    );
  }

  // Build plugin info
  const commands = Array.isArray(plugin.commands)
    ? plugin.commands
    : [plugin.commands];

  const categoryIcon: Record<string, string> = {
    general: '📋',
    owner: '👑',
    group: '👥',
    downloader: '⬇️',
    fun: '🎉',
    tools: '🔧',
  };

  const icon = categoryIcon[plugin.category] || '📌';

  let info = `
╭━━━━━━━━━━━━━━━━━━━━
┃ ${icon} *PLUGIN INFO*
┃━━━━━━━━━━━━━━━━━━━━
┃
┃ *Name:* ${plugin.name}
┃ *Category:* ${plugin.category || 'uncategorized'}
┃ *Description:*
┃   ${plugin.description || 'No description'}
┃
┃ *Commands:*
${commands.map((cmd: string) => `┃   • ${prefix}${cmd}`).join('\n')}
┃
┃ *Restrictions:*
${plugin.owner ? '┃   • 👑 Owner only' : ''}
${plugin.admin ? '┃   • 👮 Admin only' : ''}
${plugin.group ? '┃   • 👥 Group only' : ''}
${plugin.private ? '┃   • 💬 Private only' : ''}
${plugin.botAdmin ? '┃   • 🤖 Bot must be admin' : ''}
${!plugin.owner && !plugin.admin && !plugin.group && !plugin.private ? '┃   • ✅ No restrictions' : ''}
╰━━━━━━━━━━━━━━━━━━━━
  `.trim();

  await QuickReact.info(m);
  await m.reply(info);
}
