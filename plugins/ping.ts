import { Plugin, PluginContext } from '@roidev/kachina-md';
import si from 'systeminformation';

export default {
  name: 'ping',
  category: 'general',
  description: 'Mengecek kecepatan respon bot',
  commands: ['ygy'],

  async exec({ m, client }: PluginContext) {
    console.log(client)
  }
} satisfies Plugin;
