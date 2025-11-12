# React Helper - Usage Examples

Helper untuk mempermudah penggunaan react emoji di WhatsApp Bot.

## Import

```typescript
import {
  Emoji,
  react,
  processReact,
  QuickReact,
  sequentialReact,
  reactWithDelay,
  createProgressReact,
  removeReact
} from "../utils/react";
```

---

## 1. Basic Usage - Simple React

### Menggunakan Emoji Constants

```typescript
import { Emoji, react } from "../utils/react";

async exec({ m }: PluginContext) {
  await react(m, Emoji.LOADING);
  // ... do something ...
  await react(m, Emoji.SUCCESS);
}
```

### Menggunakan Custom Emoji

```typescript
await react(m, '🔥');
await react(m, '🚀');
await react(m, '💯');
```

---

## 2. Quick React Presets

Untuk react cepat tanpa perlu import Emoji constant:

```typescript
import { QuickReact } from "../utils/react";

async exec({ m }: PluginContext) {
  await QuickReact.loading(m);   // ⏳
  await QuickReact.success(m);   // ✅
  await QuickReact.error(m);     // ❌
  await QuickReact.warning(m);   // ⚠️
  await QuickReact.info(m);      // ℹ️
  await QuickReact.thinking(m);  // 🤔
  await QuickReact.fire(m);      // 🔥
  await QuickReact.rocket(m);    // 🚀
}
```

---

## 3. Process React - Automatic Loading/Success/Error

Helper otomatis untuk menampilkan loading, kemudian success atau error:

```typescript
import { processReact, Emoji } from "../utils/react";

async exec({ m }: PluginContext) {
  try {
    await processReact(m, async () => {
      // Your code here
      const result = await someAsyncOperation();
      await m.reply(`Result: ${result}`);
    });
    // Otomatis: ⏳ (loading) → ✅ (success)
  } catch (error) {
    // Otomatis: ⏳ (loading) → ❌ (error)
  }
}
```

### Custom Emoji untuk Process React

```typescript
await processReact(m, async () => {
  // Your code
}, {
  loading: '🔍',      // Custom loading emoji
  success: '🎉',      // Custom success emoji
  error: '💥',        // Custom error emoji
  showLoading: true   // Default: true
});
```

### Disable Loading (hanya success/error)

```typescript
await processReact(m, async () => {
  // Your code
}, {
  showLoading: false  // Tidak menampilkan loading emoji
});
```

---

## 4. Sequential React - Multiple Emojis

Menampilkan beberapa emoji secara berurutan dengan delay:

```typescript
import { sequentialReact, Emoji } from "../utils/react";

async exec({ m }: PluginContext) {
  // Default delay: 500ms
  await sequentialReact(m, [
    Emoji.SEARCH,    // 🔍
    Emoji.DOWNLOAD,  // ⬇️
    Emoji.SUCCESS    // ✅
  ]);
}
```

### Custom Delay

```typescript
// Delay 1 second antara setiap emoji
await sequentialReact(m, [
  '🔍', '📥', '✅'
], 1000);
```

---

## 5. React with Delay

React dengan delay sebelum menampilkan emoji:

```typescript
import { reactWithDelay, Emoji } from "../utils/react";

async exec({ m }: PluginContext) {
  await m.reply('Processing...');

  // React setelah 2 detik
  await reactWithDelay(m, Emoji.SUCCESS, 2000);
}
```

---

## 6. Progress React - Multi-Step Process

Untuk process yang memiliki banyak step:

```typescript
import { createProgressReact, Emoji } from "../utils/react";

async exec({ m }: PluginContext) {
  const updateProgress = createProgressReact(m);

  await updateProgress(Emoji.SEARCH);     // 🔍 Step 1
  await searchData();

  await updateProgress(Emoji.DOWNLOAD);   // ⬇️ Step 2
  await downloadFile();

  await updateProgress(Emoji.SAVE);       // 💾 Step 3
  await saveToDatabase();

  await updateProgress(Emoji.SUCCESS);    // ✅ Done
}
```

---

## 7. Remove React

Menghapus react emoji:

```typescript
import { removeReact } from "../utils/react";

async exec({ m }: PluginContext) {
  await react(m, Emoji.LOADING);
  // ... do something ...
  await removeReact(m);  // Menghapus emoji
}
```

---

## 8. Available Emoji Constants

### Status
- `Emoji.LOADING` - ⏳
- `Emoji.SUCCESS` - ✅
- `Emoji.ERROR` - ❌
- `Emoji.WARNING` - ⚠️
- `Emoji.INFO` - ℹ️

### Process
- `Emoji.HOURGLASS` - ⏳
- `Emoji.CLOCK` - ⏰
- `Emoji.TIMER` - ⏱️
- `Emoji.STOPWATCH` - ⏲️

### Emotions
- `Emoji.THUMBS_UP` - 👍
- `Emoji.THUMBS_DOWN` - 👎
- `Emoji.FIRE` - 🔥
- `Emoji.HEART` - ❤️
- `Emoji.STAR` - ⭐
- `Emoji.SPARKLES` - ✨
- `Emoji.PARTY` - 🎉
- `Emoji.ROCKET` - 🚀

### Actions
- `Emoji.SEARCH` - 🔍
- `Emoji.DOWNLOAD` - ⬇️
- `Emoji.UPLOAD` - ⬆️
- `Emoji.REFRESH` - 🔄
- `Emoji.DELETE` - 🗑️
- `Emoji.EDIT` - ✏️
- `Emoji.SAVE` - 💾

### Symbols
- `Emoji.CHECK` - ✔️
- `Emoji.CROSS` - ✖️
- `Emoji.QUESTION` - ❓
- `Emoji.EXCLAMATION` - ❗
- `Emoji.PLUS` - ➕
- `Emoji.MINUS` - ➖

### Others
- `Emoji.THINKING` - 🤔
- `Emoji.EYES` - 👀
- `Emoji.ROBOT` - 🤖
- `Emoji.COMPUTER` - 💻
- `Emoji.BOOK` - 📖
- `Emoji.LOCK` - 🔒
- `Emoji.UNLOCK` - 🔓
- `Emoji.KEY` - 🔑

---

## 9. Complete Plugin Example

```typescript
import { Plugin, PluginContext } from "@roidev/kachina-md";
import { processReact, Emoji, QuickReact } from "../utils/react";

export default {
  name: 'example',
  commands: ['example'],
  category: 'general',
  description: 'Example plugin using react helper',

  async exec({ m, args }: PluginContext) {
    // Validasi input
    if (!args.length) {
      await QuickReact.warning(m);
      return await m.reply('❌ Usage: .example <text>');
    }

    // Process dengan auto loading/success/error
    try {
      await processReact(m, async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send result
        await m.reply(`✅ Result: ${args.join(' ')}`);
      }, {
        loading: Emoji.SEARCH,
        success: Emoji.ROCKET,
        error: Emoji.ERROR
      });
    } catch (error: any) {
      await m.reply(`❌ Error: ${error.message}`);
    }
  }
} satisfies Plugin;
```

---

## 10. Advanced Example - Download with Progress

```typescript
import { Plugin, PluginContext } from "@roidev/kachina-md";
import { createProgressReact, Emoji } from "../utils/react";
import axios from "axios";

export default {
  name: 'download',
  commands: ['download', 'dl'],
  category: 'downloader',
  description: 'Download file with progress indicator',

  async exec({ m, args }: PluginContext) {
    if (!args[0]) {
      return await m.reply('❌ Usage: .download <url>');
    }

    const url = args[0];
    const updateProgress = createProgressReact(m);

    try {
      // Step 1: Validating URL
      await updateProgress(Emoji.SEARCH);
      if (!url.startsWith('http')) {
        throw new Error('Invalid URL');
      }

      // Step 2: Downloading
      await updateProgress(Emoji.DOWNLOAD);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Step 3: Uploading to WhatsApp
      await updateProgress(Emoji.UPLOAD);
      await m.reply('File downloaded successfully!');

      // Step 4: Done
      await updateProgress(Emoji.SUCCESS);

    } catch (error: any) {
      await updateProgress(Emoji.ERROR);
      await m.reply(`❌ Error: ${error.message}`);
    }
  }
} satisfies Plugin;
```

---

## Tips

1. **Gunakan `processReact`** untuk operasi async yang simple (loading → success/error)
2. **Gunakan `createProgressReact`** untuk multi-step process
3. **Gunakan `QuickReact`** untuk react cepat tanpa import Emoji
4. **Gunakan `sequentialReact`** untuk animasi emoji berurutan
5. **Selalu gunakan try-catch** ketika menggunakan react untuk menghindari error

---

## TypeScript Support

Helper ini fully typed dengan TypeScript:

```typescript
import { EmojiType } from "../utils/react";

// Type untuk Emoji values
const myEmoji: EmojiType = Emoji.SUCCESS; // ✅

// IntelliSense akan menampilkan semua emoji yang tersedia
```
