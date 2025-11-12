# Message Helper - Usage Examples

Helper untuk mempermudah pengiriman pesan standar dengan format yang konsisten.

## Import

```typescript
import {
  // Basic messages
  sendLoading,
  sendSuccess,
  sendError,
  sendWarning,
  sendInfo,
  sendWait,
  sendDownloading,
  sendUploading,

  // Validation
  sendInvalidUsage,
  sendMissingArg,
  sendInvalidUrl,
  sendNoMedia,

  // Permissions
  sendOwnerOnly,
  sendAdminOnly,
  sendGroupOnly,
  sendPrivateOnly,
  sendBotNotAdmin,

  // Status
  sendMaintenance,
  sendNotFound,
  sendTimeout,
  sendRateLimit,
  sendProgress,

  // Format helpers
  formatFileSize,
  formatDuration,
  formatNumber,
  formatDate,
  formatUptime,

  // Combined
  processWithMessage,
  QuickMessage
} from "../utils/message";
```

---

## 1. Basic Messages

### Loading / Waiting Message

```typescript
import { sendLoading, sendWait } from "../utils/message";

async exec({ m }: PluginContext) {
  // Basic loading
  await sendLoading(m);
  // Output: ⏳ LOADING
  //         Mohon tunggu...

  // Custom loading message
  await sendLoading(m, 'Mengunduh file...');
  // Output: ⏳ LOADING
  //         Mengunduh file...

  // Wait with time estimate
  await sendWait(m, 30);
  // Output: ⏰ Tunggu sebentar (±30 detik)...
}
```

### Success Message

```typescript
import { sendSuccess } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendSuccess(m, 'File berhasil diunduh!');
  // Output: ✅ SUKSES
  //         File berhasil diunduh!
}
```

### Error Message

```typescript
import { sendError } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendError(m, 'Gagal mengunduh file!');
  // Output: ❌ ERROR
  //         Gagal mengunduh file!
}
```

### Warning Message

```typescript
import { sendWarning } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendWarning(m, 'File terlalu besar, mungkin memakan waktu lama!');
  // Output: ⚠️ PERHATIAN
  //         File terlalu besar, mungkin memakan waktu lama!
}
```

### Info Message

```typescript
import { sendInfo } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendInfo(m, 'Bot sedang dalam mode maintenance.');
  // Output: ℹ️ INFO
  //         Bot sedang dalam mode maintenance.
}
```

### Downloading / Uploading

```typescript
import { sendDownloading, sendUploading } from "../utils/message";

async exec({ m }: PluginContext) {
  // Basic
  await sendDownloading(m);
  // Output: ⬇️ DOWNLOADING
  //         Mohon tunggu...

  // With filename
  await sendDownloading(m, 'video.mp4');
  // Output: ⬇️ DOWNLOADING
  //         File: video.mp4
  //         Mohon tunggu...

  await sendUploading(m, 'photo.jpg');
  // Output: ⬆️ UPLOADING
  //         File: photo.jpg
  //         Mohon tunggu...
}
```

---

## 2. Validation Messages

### Invalid Usage

```typescript
import { sendInvalidUsage } from "../utils/message";

async exec({ m, command, prefix }: PluginContext) {
  await sendInvalidUsage(
    m,
    command,
    `${prefix}${command} <url>`,
    `${prefix}${command} https://youtube.com/watch?v=xxx`
  );
  // Output: ❌ PENGGUNAAN SALAH
  //         Cara pakai: .ytmp3 <url>
  //         Contoh: .ytmp3 https://youtube.com/watch?v=xxx
}
```

### Missing Argument

```typescript
import { sendMissingArg } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendMissingArg(m, 'URL');
  // Output: ❌ ERROR
  //         Parameter "URL" tidak ditemukan!
}
```

### Invalid URL

```typescript
import { sendInvalidUrl } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendInvalidUrl(m);
  // Output: ❌ ERROR
  //         URL tidak valid!
  //         Pastikan URL dimulai dengan http:// atau https://
}
```

### No Media

```typescript
import { sendNoMedia } from "../utils/message";

async exec({ m }: PluginContext) {
  // Default
  await sendNoMedia(m);
  // Output: ❌ ERROR
  //         Kirim atau reply gambar/video terlebih dahulu!

  // Custom media type
  await sendNoMedia(m, 'gambar');
  // Output: ❌ ERROR
  //         Kirim atau reply gambar terlebih dahulu!
}
```

---

## 3. Permission Messages

### Owner Only

```typescript
import { sendOwnerOnly } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendOwnerOnly(m);
  // Output: 🔒 AKSES DITOLAK
  //         Perintah ini hanya untuk owner!
}
```

### Admin Only

```typescript
import { sendAdminOnly } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendAdminOnly(m);
  // Output: 🔒 AKSES DITOLAK
  //         Perintah ini hanya untuk admin grup!
}
```

### Group Only

```typescript
import { sendGroupOnly } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendGroupOnly(m);
  // Output: ❌ ERROR
  //         Perintah ini hanya bisa digunakan di grup!
}
```

### Private Only

```typescript
import { sendPrivateOnly } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendPrivateOnly(m);
  // Output: ❌ ERROR
  //         Perintah ini hanya bisa digunakan di private chat!
}
```

### Bot Not Admin

```typescript
import { sendBotNotAdmin } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendBotNotAdmin(m);
  // Output: ❌ ERROR
  //         Bot harus menjadi admin grup untuk menggunakan perintah ini!
}
```

---

## 4. Status Messages

### Maintenance

```typescript
import { sendMaintenance } from "../utils/message";

async exec({ m }: PluginContext) {
  // General
  await sendMaintenance(m);
  // Output: ⚠️ MAINTENANCE
  //         Fitur sedang dalam perbaikan.
  //         Mohon coba lagi nanti.

  // Specific feature
  await sendMaintenance(m, 'downloader YouTube');
  // Output: ⚠️ MAINTENANCE
  //         Fitur downloader YouTube sedang dalam perbaikan.
  //         Mohon coba lagi nanti.
}
```

### Not Found

```typescript
import { sendNotFound } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendNotFound(m, 'Video');
  // Output: ❌ NOT FOUND
  //         Video tidak ditemukan!
}
```

### Timeout

```typescript
import { sendTimeout } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendTimeout(m);
  // Output: ❌ TIMEOUT
  //         Proses melebihi batas waktu.
  //         Silakan coba lagi.
}
```

### Rate Limit

```typescript
import { sendRateLimit } from "../utils/message";

async exec({ m }: PluginContext) {
  // Basic
  await sendRateLimit(m);
  // Output: ⚠️ RATE LIMIT
  //         Anda terlalu banyak melakukan request.

  // With wait time
  await sendRateLimit(m, 60);
  // Output: ⚠️ RATE LIMIT
  //         Anda terlalu banyak melakukan request.
  //         Tunggu 60 detik sebelum mencoba lagi.
}
```

### Progress

```typescript
import { sendProgress } from "../utils/message";

async exec({ m }: PluginContext) {
  await sendProgress(m, 50, 'Downloading');
  // Output: ⏳ DOWNLOADING
  //         █████░░░░░
  //         50%
}
```

---

## 5. Format Helpers

### Format File Size

```typescript
import { formatFileSize } from "../utils/message";

const size1 = formatFileSize(1024);        // "1 KB"
const size2 = formatFileSize(1048576);     // "1 MB"
const size3 = formatFileSize(1073741824);  // "1 GB"
const size4 = formatFileSize(2500000);     // "2.38 MB"

await m.reply(`File size: ${formatFileSize(fileSize)}`);
```

### Format Duration

```typescript
import { formatDuration } from "../utils/message";

const dur1 = formatDuration(125);     // "2:05"
const dur2 = formatDuration(3665);    // "1:01:05"
const dur3 = formatDuration(45);      // "0:45"

await m.reply(`Duration: ${formatDuration(videoLength)}`);
```

### Format Number

```typescript
import { formatNumber } from "../utils/message";

const num1 = formatNumber(1000);       // "1.000"
const num2 = formatNumber(1000000);    // "1.000.000"
const num3 = formatNumber(1234567);    // "1.234.567"

await m.reply(`Views: ${formatNumber(viewCount)}`);
```

### Format Date

```typescript
import { formatDate } from "../utils/message";

const date = formatDate();
// "Jumat, 10 November 2025 14:30"

const customDate = formatDate(new Date('2024-01-01'));
// "Senin, 1 Januari 2024 00:00"

await m.reply(`Upload date: ${formatDate(uploadDate)}`);
```

### Format Uptime

```typescript
import { formatUptime } from "../utils/message";

const uptime = process.uptime();
const formatted = formatUptime(uptime);
// "2 hari, 5 jam, 30 menit, 15 detik"

await m.reply(`Bot uptime: ${formatUptime(process.uptime())}`);
```

---

## 6. Quick Message (Presets)

Untuk pengiriman pesan cepat:

```typescript
import { QuickMessage } from "../utils/message";

async exec({ m }: PluginContext) {
  await QuickMessage.loading(m);
  await QuickMessage.success(m, 'Berhasil!');
  await QuickMessage.error(m, 'Gagal!');
  await QuickMessage.warning(m, 'Perhatian!');
  await QuickMessage.info(m, 'Informasi');
  await QuickMessage.wait(m, 30);
  await QuickMessage.downloading(m, 'file.mp4');
  await QuickMessage.uploading(m, 'photo.jpg');
  await QuickMessage.notFound(m, 'Video');
  await QuickMessage.ownerOnly(m);
  await QuickMessage.adminOnly(m);
  await QuickMessage.groupOnly(m);
  await QuickMessage.privateOnly(m);
  await QuickMessage.maintenance(m, 'API');
  await QuickMessage.timeout(m);
  await QuickMessage.rateLimit(m, 60);
}
```

---

## 7. Process With Message

Helper untuk process dengan loading dan result message otomatis:

```typescript
import { processWithMessage } from "../utils/message";

async exec({ m }: PluginContext) {
  try {
    const result = await processWithMessage(
      m,
      'Mengunduh video...',              // Loading message
      async () => {
        // Your async code here
        const video = await downloadVideo(url);
        return video;
      },
      {
        successMsg: 'Video berhasil diunduh!',     // Success message
        errorMsg: 'Gagal mengunduh video!',        // Error message (optional)
      }
    );

    // result berisi return value dari callback
  } catch (error) {
    // Error sudah di-handle secara otomatis
  }
}
```

### Dynamic Messages

```typescript
await processWithMessage(
  m,
  'Searching...',
  async () => {
    const results = await search(query);
    return results;
  },
  {
    successMsg: (results) => `Ditemukan ${results.length} hasil!`,
    errorMsg: (error) => `Search error: ${error.message}`
  }
);
```

---

## 8. Custom React Emoji

Semua message helper mendukung custom react emoji:

```typescript
import { sendSuccess } from "../utils/message";

// Default react (✅)
await sendSuccess(m, 'Berhasil!');

// Custom react
await sendSuccess(m, 'Berhasil!', { react: '🎉' });

// No react
await sendSuccess(m, 'Berhasil!', { react: false });
```

---

## 9. Complete Plugin Example

```typescript
import { Plugin, PluginContext } from "@roidev/kachina-md";
import {
  sendInvalidUsage,
  sendInvalidUrl,
  sendDownloading,
  sendSuccess,
  sendError,
  formatFileSize,
  formatDuration,
  QuickMessage
} from "../utils/message";
import axios from "axios";

export default {
  name: 'ytmp3',
  commands: ['ytmp3', 'yta'],
  category: 'downloader',
  description: 'Download audio from YouTube',

  async exec({ m, args, prefix, command }: PluginContext) {
    // Validasi
    if (!args[0]) {
      return await sendInvalidUsage(
        m,
        command,
        `${prefix}${command} <url>`,
        `${prefix}${command} https://youtube.com/watch?v=xxx`
      );
    }

    const url = args[0];

    // Validasi URL
    if (!url.startsWith('http')) {
      return await sendInvalidUrl(m);
    }

    try {
      // Send downloading message
      await sendDownloading(m);

      // Fetch data dari API
      const response = await axios.get(`https://api.example.com/ytmp3?url=${url}`);
      const data = response.data;

      // Format info
      const info = `*${data.title}*\n\n` +
                   `Duration: ${formatDuration(data.duration)}\n` +
                   `Size: ${formatFileSize(data.filesize)}\n` +
                   `Quality: ${data.quality}`;

      await m.reply(info);

      // Upload audio
      await QuickMessage.uploading(m, data.title);
      // await client.sendAudio(m.chat, data.url);

      // Success
      await sendSuccess(m, 'Audio berhasil diunduh!');

    } catch (error: any) {
      await sendError(m, error.message);
    }
  }
} satisfies Plugin;
```

---

## 10. Advanced Example - With Permissions

```typescript
import { Plugin, PluginContext } from "@roidev/kachina-md";
import {
  sendOwnerOnly,
  sendGroupOnly,
  sendBotNotAdmin,
  sendSuccess,
  sendError,
  QuickMessage
} from "../utils/message";

export default {
  name: 'kick',
  commands: ['kick'],
  category: 'group',
  description: 'Kick user from group',

  async exec({ m, client, sock }: PluginContext) {
    // Check if group
    if (!m.isGroup) {
      return await sendGroupOnly(m);
    }

    // Check if user is admin/owner
    const isOwner = client.config.owner.includes(m.sender);
    if (!isOwner) {
      return await sendOwnerOnly(m);
    }

    // Check if bot is admin
    const groupMetadata = await sock.groupMetadata(m.chat);
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);

    if (!botParticipant?.admin) {
      return await sendBotNotAdmin(m);
    }

    // Get mentioned users
    const mentioned = m.mentions;
    if (!mentioned.length) {
      return await sendError(m, 'Tag user yang ingin di-kick!');
    }

    try {
      await QuickMessage.loading(m, 'Mengeluarkan user...');

      // Kick users
      await sock.groupParticipantsUpdate(m.chat, mentioned, 'remove');

      await sendSuccess(m, `Berhasil mengeluarkan ${mentioned.length} user!`);

    } catch (error: any) {
      await sendError(m, error.message);
    }
  }
} satisfies Plugin;
```

---

## Tips

1. **Gunakan `QuickMessage`** untuk pesan cepat tanpa banyak import
2. **Gunakan `processWithMessage`** untuk operasi async dengan loading/success/error otomatis
3. **Gunakan format helpers** untuk menampilkan angka, ukuran file, durasi, dll dengan format yang konsisten
4. **Kombinasikan dengan React helper** untuk UX yang lebih baik (emoji + message)
5. **Gunakan validation helpers** untuk mengurangi code repetition

---

## Integration with React Helper

Kombinasi message + react helper untuk UX terbaik:

```typescript
import { processReact, Emoji } from "../utils/react";
import { sendSuccess, sendError } from "../utils/message";

async exec({ m }: PluginContext) {
  try {
    await processReact(m, async () => {
      // Do something
      await doSomething();

      // Send success message (react sudah otomatis dari processReact)
      await sendSuccess(m, 'Berhasil!', { react: false });
    });
  } catch (error: any) {
    // Send error message (react sudah otomatis dari processReact)
    await sendError(m, error.message, { react: false });
  }
}
```
