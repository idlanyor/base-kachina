import { Plugin, PluginContext } from "@roidev/kachina-md";
import { formatUptime, formatFileSize, formatNumber } from "../utils/message";
import { QuickReact } from "../utils/react";
import si from "systeminformation";
import os from "os";

export default {
  name: 'botinfo',
  commands: ['botinfo', 'info', 'stats'],
  category: 'general',
  description: 'Menampilkan informasi bot dan statistik',

  async exec({ m, client }: PluginContext) {
    await QuickReact.loading(m);

    try {
      // Get system info
      const cpuUsage = await si.currentLoad();
      const mem = await si.mem();
      const osInfo = await si.osInfo();

      // Get plugin count
      const pluginCount = await getPluginCount(client);

      // Bot info
      const botNumber = client.user?.id?.split(':')[0] || 'Unknown';
      const botName = client.user?.name || client.user?.pushName || 'WhatsApp Bot';

      // Owner info
      const owner = client.config?.owner || 'Unknown';
      const ownerList = Array.isArray(owner)
        ? owner.map((o: string) => `@${o.split('@')[0]}`).join(', ')
        : `@${owner.toString().split('@')[0]}`;

      // Uptime
      const botUptime = formatUptime(process.uptime());
      const systemUptime = formatUptime(os.uptime());

      // Load average (1, 5, 15 minutes)
      const loadAvg = os.loadavg();

      // Memory usage
      const memUsed = mem.used;
      const memTotal = mem.total;
      const memPercent = ((memUsed / memTotal) * 100).toFixed(1);

      // CPU info
      const cpuModel = os.cpus()[0].model;
      const cpuCores = os.cpus().length;
      const cpuPercent = cpuUsage.currentLoad.toFixed(1);

      // Platform
      const platform = osInfo.platform || process.platform;
      const arch = osInfo.arch || process.arch;
      const nodeVersion = process.version;

      const info = `
╭━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *BOT INFORMATION*
┃━━━━━━━━━━━━━━━━━━━━
┃
┃ *Bot Details:*
┃ • Name: ${botName}
┃ • Number: ${botNumber}
┃ • Prefix: ${client.config.prefix || '.'}
┃ • Owner: ${ownerList}
┃
┃ *Statistics:*
┃ • Bot Uptime: ${botUptime}
┃ • System Uptime: ${systemUptime}
┃ • Plugins: ${pluginCount.total}
┃   ├ Owner: ${pluginCount.owner}
┃   ├ Group: ${pluginCount.group}
┃   └ General: ${pluginCount.general}
┃
┃ *System:*
┃ • OS: ${platform} (${arch})
┃ • CPU: ${cpuModel}
┃   ├ Cores: ${cpuCores}
┃   ├ Usage: ${cpuPercent}%
┃   └ Load Avg: ${loadAvg.map(l => l.toFixed(2)).join(', ')}
┃ • RAM: ${formatFileSize(memUsed)} / ${formatFileSize(memTotal)}
┃   └ Usage: ${memPercent}%
┃ • Node: ${nodeVersion}
┃
╰━━━━━━━━━━━━━━━━━━━━

💡 *Powered by:*
• Kachina-MD (WhatsApp Bot Framework)
• Baileys (WhatsApp Web API)
      `.trim();

      await QuickReact.success(m);

      // Send with mentions
      const mentions = Array.isArray(client.config.owner)
        ? client.config.owner
        : [client.config.owner];

      await m.reply(info, { mentions });

    } catch (error: any) {
      await QuickReact.error(m);
      await m.reply(`❌ Error: ${error.message}`);
    }
  }
} satisfies Plugin;

// ==================== HELPER FUNCTIONS ====================

/**
 * Get plugin count grouped by category
 */
async function getPluginCount(client: any): Promise<{
  total: number;
  owner: number;
  group: number;
  general: number;
  [key: string]: number;
}> {
  const plugins = getLoadedPlugins(client);

  const count: any = {
    total: plugins.length,
    owner: 0,
    group: 0,
    general: 0,
  };

  for (const plugin of plugins) {
    if (plugin.category) {
      if (!count[plugin.category]) {
        count[plugin.category] = 0;
      }
      count[plugin.category]++;
    }

    // Count by type
    if (plugin.owner) count.owner++;
    if (plugin.group) count.group++;
    if (!plugin.owner && !plugin.group) count.general++;
  }

  return count;
}

/**
 * Get all loaded plugins from client
 */
function getLoadedPlugins(client: any): any[] {
  let plugins: any[] = [];

  try {
    // Framework kachina-md stores plugins in client.pluginHandler.plugins
    if (client.pluginHandler && client.pluginHandler.plugins) {
      const pluginStore = client.pluginHandler.plugins;

      // Check if it's a Map
      if (pluginStore instanceof Map) {
        plugins = Array.from(pluginStore.values());
      }
      // Check if it's an Array
      else if (Array.isArray(pluginStore)) {
        plugins = pluginStore;
      }
      // Check if it's a plain object
      else if (typeof pluginStore === 'object') {
        plugins = Object.values(pluginStore);
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
