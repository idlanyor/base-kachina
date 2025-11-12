import { Plugin, PluginContext } from "@roidev/kachina-md";
import { exec } from "child_process";
import util from "util";
import { processReact, Emoji } from "../utils/react";
import { sendInvalidUsage, sendTimeout } from "../utils/message";

const execPromise = util.promisify(exec);

export default {
  name: 'exec',
  commands: ['exec', 'sh', '$'],
  category: 'owner',
  description: 'Execute shell commands (Owner only)',
  owner: true,

  async exec({ m, args, prefix, command }: PluginContext) {
    if (!args.length) {
      return await sendInvalidUsage(
        m,
        command,
        `${prefix}${command} <command>`,
        `${prefix}${command} ls -la`
      );
    }

    const cmd = args.join(' ');

    try {
      // Using processReact helper for automatic loading/success/error reactions
      await processReact(m, async () => {
        const { stdout, stderr } = await execPromise(cmd, {
          timeout: 60000, // 60 second timeout
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });

        let output = '';

        if (stdout) {
          output += `*STDOUT:*\n\`\`\`\n${stdout}\n\`\`\`\n\n`;
        }

        if (stderr) {
          output += `*STDERR:*\n\`\`\`\n${stderr}\n\`\`\``;
        }

        if (!output) {
          output = '✅ Command executed successfully (no output)';
        }

        // Truncate if too long
        const maxLength = 4000;
        if (output.length > maxLength) {
          output = output.substring(0, maxLength) + '\n\n... (output truncated)';
        }

        await m.reply(output);
      }, {
        loading: Emoji.LOADING,
        success: Emoji.SUCCESS,
        error: Emoji.ERROR
      });

    } catch (error: any) {
      // Handle timeout specifically
      if (error.code === 'ETIMEDOUT') {
        return await sendTimeout(m);
      }

      // Handle other errors
      let errorMsg = `\`\`\`\n`;

      if (error.code) {
        errorMsg += `Exit code: ${error.code}\n`;
      }

      if (error.stdout) {
        errorMsg += `\nStdout:\n${error.stdout}`;
      }

      if (error.stderr) {
        errorMsg += `\nStderr:\n${error.stderr}`;
      } else if (error.message) {
        errorMsg += `\n${error.message}`;
      }

      errorMsg += `\n\`\`\``;

      await m.reply(`❌ *EXEC ERROR:*\n\n${errorMsg}`);
    }
  }
} satisfies Plugin;
