import { Plugin, PluginContext } from "@antidonasi/kachina";
import { exec } from "child_process";
import util from "util";
import { sendInvalidUsage, sendTimeout } from "../utils/message.js";

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
  }
} satisfies Plugin;
