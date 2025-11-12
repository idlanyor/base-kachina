import { Plugin, PluginContext } from "@roidev/kachina-md";
import util from "util";
import { sendInvalidUsage, sendError } from "../utils/message";
import { react, Emoji } from "../utils/react";

export default {
  name: 'eval',
  commands: ['eval', 'ev'],
  category: 'owner',
  description: 'Execute JavaScript code (Owner only)',
  owner: true,

  async exec({ m, args, client, sock, command, prefix }: PluginContext) {
    if (!args.length) {
      return await sendInvalidUsage(
        m,
        command,
        `${prefix}${command} <code>`,
        `${prefix}${command} return "Hello World"`
      );
    }

    try {
      await react(m, Emoji.LOADING);

      const code = args.join(' ');

      // Evaluate the code with access to context
      let result = await eval(`(async () => { ${code} })()`);

      // Format the output
      if (typeof result !== 'string') {
        result = util.inspect(result, { depth: 3 });
      }

      // Truncate if too long
      const maxLength = 4000;
      if (result.length > maxLength) {
        result = result.substring(0, maxLength) + '...';
      }

      await react(m, Emoji.SUCCESS);
      await m.reply(`✅ *EVAL RESULT:*\n\n\`\`\`js\n${result}\n\`\`\``);

    } catch (error: any) {
      await sendError(m, `\`\`\`\n${error.message}\n${error.stack}\n\`\`\``);
    }
  }
} satisfies Plugin;
