import { Plugin, PluginContext } from "@roidev/kachina-md";
import util from "util";

export default {
  name: 'debug',
  commands: ['debug'],
  category: 'owner',
  description: 'Debug client structure',
  // owner: true,

  async exec({ m, client, args }: PluginContext) {
    console.log('Owner from config',client.config.owner)
    console.log('owner from client',m.sender)
    console.log('isOwner',client.pluginHandler.isOwner(m.sender))
    if (!args[0]) {
      return await m.reply(`Usage: .debug <object>

Available objects:
- client
- pluginHandler
- plugins
- keys`);
    }

    try {
      let result: any;

      switch (args[0]) {
        case 'client':
          result = {
            keys: Object.keys(client),
            hasPluginHandler: !!client.pluginHandler,
            hasHandler: !!(client as any).handler,
            hasPlugins: !!(client as any).plugins,
          };
          break;

        case 'pluginHandler':
          if (client.pluginHandler) {
            result = {
              keys: Object.keys(client.pluginHandler),
              plugins: client.pluginHandler.plugins,
              pluginsType: typeof client.pluginHandler.plugins,
              pluginsIsArray: Array.isArray(client.pluginHandler.plugins),
              pluginsIsMap: client.pluginHandler.plugins instanceof Map,
            };
          } else {
            result = 'pluginHandler not found';
          }
          break;

        case 'plugins':
          if (client.pluginHandler?.plugins) {
            const plugins: any = client.pluginHandler.plugins;
            if (plugins instanceof Map) {
              const values = Array.from(plugins.values());
              result = {
                type: 'Map',
                size: plugins.size,
                keys: Array.from(plugins.keys()),
                sample: values.length > 0 ? values[0] : null,
              };
            } else if (Array.isArray(plugins)) {
              result = {
                type: 'Array',
                length: plugins.length,
                sample: plugins[0],
              };
            } else {
              result = {
                type: typeof plugins,
                keys: Object.keys(plugins),
              };
            }
          } else {
            result = 'plugins not found';
          }
          break;

        case 'keys':
          result = {
            client: Object.keys(client),
            pluginHandler: client.pluginHandler ? Object.keys(client.pluginHandler) : null,
          };
          break;

        default:
          return await m.reply('Invalid object. Use: client, pluginHandler, plugins, or keys');
      }

      const output = util.inspect(result, { depth: 3, colors: false });
      await m.reply(`\`\`\`\n${output}\n\`\`\``);

    } catch (error: any) {
      await m.reply(`Error: ${error.message}`);
    }
  }
} satisfies Plugin;
