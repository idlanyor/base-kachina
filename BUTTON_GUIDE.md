# 📱 Panduan Implementasi Button di Kachina-MD

Dokumentasi lengkap penggunaan button interaktif di bot WhatsApp menggunakan @roidev/kachina-md v2.3.0

## 📋 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Tipe-tipe Button](#tipe-tipe-button)
3. [Plugin Demo](#plugin-demo)
4. [Contoh Penggunaan](#contoh-penggunaan)
5. [API Reference](#api-reference)

## 🎯 Pengenalan

Kachina-MD mendukung berbagai jenis button interaktif yang dapat meningkatkan pengalaman pengguna bot WhatsApp. Button memungkinkan user untuk berinteraksi dengan bot melalui tombol-tombol yang dapat diklik.

### Keuntungan Menggunakan Button:
- ✅ Interface lebih user-friendly
- ✅ Mengurangi kesalahan input
- ✅ Navigasi yang lebih intuitif
- ✅ Pengalaman pengguna yang lebih baik

## 🔘 Tipe-tipe Button

### 1. Button Sederhana (Simple Buttons)

Button dasar dengan teks dan ID untuk callback.

```typescript
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
  'Apakah kamu setuju?',
  buttons,
  {
    footer: 'Pilih salah satu',
    quoted: m
  }
);
```

### 2. List Button (Dropdown)

Button dengan dropdown menu yang dapat menampung banyak pilihan.

```typescript
const sections = [
  {
    title: '📋 Kategori 1',
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
  }
];

await client.sendListMessage(
  m.chat,
  'Klik tombol di bawah',
  {
    text: 'Pilih menu!',
    footer: 'Footer text',
    buttonText: 'Pilih Menu',
    sections
  },
  {
    quoted: m
  }
);
```

### 3. Template Buttons

Button dengan berbagai tipe (quick reply, URL, call).

```typescript
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
    urlButton: {
      displayText: '📚 Docs',
      url: 'https://kachina-core.antidonasi.web.id/'
    }
  },
  {
    index: 3,
    callButton: {
      displayText: '📞 Call',
      phoneNumber: '+62xxx'
    }
  }
];

await client.sendTemplateButtons(
  m.chat,
  templateButtons,
  {
    text: 'Template button demo',
    footer: 'Footer text'
  },
  {
    quoted: m
  }
);
```

## 🎮 Plugin Demo

### 1. Button Demo (`/button` atau `/btn`)

Plugin utama untuk demo berbagai tipe button:

**Commands:**
- `/button simple` - Demo button sederhana
- `/button list` - Demo list button
- `/button template` - Demo template button
- `/button multi` - Demo multiple buttons
- `/button url` - Demo URL button
- `/button call` - Demo call button

**Lokasi:** `plugins/button-demo.ts`

### 2. Button Interactive (`/quiz`, `/poll`, `/survey`)

Plugin interaktif menggunakan button untuk quiz, polling, dan survey:

**Commands:**
- `/quiz` - Quiz interaktif dengan button
- `/poll` - Polling dengan rating button
- `/survey` - Survey dengan list button

**Lokasi:** `plugins/button-interactive.ts`

### 3. Button Menu (`/bmenu`)

Menu navigasi lengkap dengan button:

**Commands:**
- `/bmenu` atau `/buttonmenu` - Menu utama dengan list button

**Lokasi:** `plugins/button-menu.ts`

## 💡 Contoh Penggunaan

### Use Case 1: Konfirmasi Aksi

```typescript
import { showConfirmation } from './plugins/button-menu';

// Dalam plugin exec function
await showConfirmation(
  m,
  client,
  'Hapus Data',
  'Semua data akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
  'confirm_delete',
  'cancel_delete'
);
```

### Use Case 2: Menu Kategori

```typescript
const sections = [
  {
    title: '🎮 Fitur',
    rows: [
      {
        title: 'Downloader',
        rowId: 'category_dl',
        description: 'Download video, musik'
      },
      {
        title: 'Games',
        rowId: 'category_games',
        description: 'Permainan seru'
      }
    ]
  }
];

await client.sendListMessage(
  m.chat,
  'Pilih kategori',
  {
    text: '🎯 Menu Kategori',
    buttonText: 'Buka Menu',
    sections
  }
);
```

### Use Case 3: Quick Actions

```typescript
import { showQuickActions } from './plugins/button-menu';

// Tampilkan quick action buttons
await showQuickActions(m, client, prefix);
```

## 📚 API Reference

### sendButtonMessage

Mengirim pesan dengan simple buttons.

**Parameters:**
- `jid` (string) - Chat ID tujuan
- `text` (string) - Teks pesan
- `buttons` (array) - Array of button objects
- `options` (object) - Optional parameters (footer, quoted)

**Button Object:**
```typescript
{
  buttonId: string,      // ID untuk callback
  buttonText: {
    displayText: string  // Teks yang ditampilkan
  },
  type: 1               // Tipe button (1 = default)
}
```

### sendListMessage

Mengirim pesan dengan list/dropdown button.

**Parameters:**
- `jid` (string) - Chat ID tujuan
- `title` (string) - Judul button
- `content` (object) - Konten pesan
- `options` (object) - Optional parameters

**Content Object:**
```typescript
{
  text: string,          // Teks pesan
  footer: string,        // Footer text
  buttonText: string,    // Teks pada button
  sections: array        // Array of sections
}
```

**Section Object:**
```typescript
{
  title: string,         // Judul section
  rows: [
    {
      title: string,     // Judul row
      rowId: string,     // ID untuk callback
      description: string // Deskripsi row
    }
  ]
}
```

### sendTemplateButtons

Mengirim pesan dengan template buttons (quick reply, URL, call).

**Parameters:**
- `jid` (string) - Chat ID tujuan
- `buttons` (array) - Array of template button objects
- `content` (object) - Konten pesan
- `options` (object) - Optional parameters

**Template Button Types:**

1. **Quick Reply Button:**
```typescript
{
  index: number,
  quickReplyButton: {
    displayText: string,
    id: string
  }
}
```

2. **URL Button:**
```typescript
{
  index: number,
  urlButton: {
    displayText: string,
    url: string
  }
}
```

3. **Call Button:**
```typescript
{
  index: number,
  callButton: {
    displayText: string,
    phoneNumber: string
  }
}
```

## 🔧 Tips & Best Practices

1. **Batasi Jumlah Button**: Maksimal 3-4 button untuk simple buttons
2. **Gunakan Emoji**: Tambahkan emoji pada teks button untuk visual yang lebih menarik
3. **ID yang Deskriptif**: Gunakan ID yang jelas seperti `menu_home`, `confirm_delete`
4. **Deskripsi yang Jelas**: Untuk list button, berikan deskripsi yang informatif
5. **Footer Text**: Manfaatkan footer untuk informasi tambahan
6. **Error Handling**: Selalu wrap dengan try-catch untuk menangani error
7. **Loading State**: Gunakan `QuickReact.loading()` sebelum mengirim button

## 📖 Referensi

- [Kachina-MD Documentation](https://kachina-core.antidonasi.web.id/)
- [Kachina-MD NPM](https://www.npmjs.com/package/@roidev/kachina-md)
- [Kachina-Core GitHub](https://github.com/idlanyor/kachina-core)

## ✨ Contoh Plugin Lengkap

Lihat file berikut untuk contoh implementasi lengkap:
- `plugins/button-demo.ts` - Demo semua tipe button
- `plugins/button-interactive.ts` - Quiz, poll, survey dengan button
- `plugins/button-menu.ts` - Menu navigasi dengan button

---

**Dibuat dengan ❤️ menggunakan @roidev/kachina-md v2.3.0**
