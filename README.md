# WhatsApp Bot dengan Kachina-MD

Bot WhatsApp yang dibuat menggunakan framework [@roidev/kachina-md](https://github.com/idlanyor/kachina-core)

## Fitur

- System plugin modular
- Auto-reconnect
- Database terintegrasi (LowDB)
- Support QR Code dan Pairing Code
- Event-driven architecture

## Instalasi

1. Clone atau download project ini

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dari template:
```bash
cp .env.example .env
```

4. Edit file `.env` dan sesuaikan konfigurasi:
```env
SESSION_ID=kachina-session
PREFIX=!
OWNER_NUMBER=628xxx
```

## Menjalankan Bot

### Development Mode (dengan auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

## Cara Login

Saat pertama kali menjalankan bot, akan muncul QR Code di terminal. Scan QR Code tersebut menggunakan WhatsApp di HP Anda:

1. Buka WhatsApp
2. Tap menu (titik tiga) > Linked Devices
3. Tap "Link a Device"
4. Scan QR Code yang muncul di terminal

## Daftar Command

### General
- `!menu` - Menampilkan daftar command
- `!ping` - Mengecek kecepatan respon bot
- `!info` - Menampilkan informasi bot

### Converter
- `!sticker` - Mengubah gambar/video menjadi sticker

### Fun
- `!quote` - Menampilkan quote random
- `!motivasi` - Menampilkan kata motivasi

## Struktur Project

```
whatsapp-bot/
├── index.js              # File utama bot
├── plugins/              # Folder untuk plugin/command
│   ├── menu.js
│   ├── ping.js
│   ├── info.js
│   ├── sticker.js
│   ├── quote.js
│   └── motivasi.js
├── package.json
├── .env                  # Konfigurasi (jangan di-commit)
├── .env.example          # Template konfigurasi
└── README.md
```

## Membuat Plugin Baru

Buat file baru di folder `plugins/`, contoh `plugins/hello.js`:

```javascript
export default {
  name: 'hello',
  category: 'general',
  description: 'Menyapa pengguna',
  aliases: ['hi', 'halo'],

  async exec({ m, args, prefix }) {
    const name = args.join(' ') || m.pushName;
    await m.reply(`Halo ${name}! Selamat datang 👋`);
  }
};
```

Plugin akan otomatis ter-load saat bot dijalankan.

## Message Object Properties

- `m.body` - Isi pesan
- `m.sender` - Nomor pengirim
- `m.pushName` - Nama pengirim
- `m.isGroup` - Apakah pesan dari grup
- `m.chat` - ID chat
- `m.quoted` - Pesan yang di-reply
- `m.type` - Tipe pesan (imageMessage, videoMessage, dll)

## Message Object Methods

- `m.reply(text)` - Balas pesan
- `m.react(emoji)` - Reaksi dengan emoji
- `m.download()` - Download media
- `m.delete()` - Hapus pesan
- `m.forward(jid)` - Forward pesan

## Database

Bot menggunakan LowDB untuk database. Contoh penggunaan:

```javascript
import { db } from '@roidev/kachina-md';

// Set data
await db.set('users.123.name', 'John');

// Get data
const name = await db.get('users.123.name');

// Check if exists
const exists = await db.has('users.123');

// Delete data
await db.delete('users.123');
```

## Troubleshooting

### Bot tidak muncul QR Code
- Pastikan internet stabil
- Hapus folder session dan coba lagi
- Periksa apakah port tidak terblokir

### Bot tidak merespon command
- Periksa prefix di .env sudah benar
- Pastikan format plugin sudah benar
- Cek log error di terminal

### Connection Lost
- Bot akan otomatis reconnect
- Jika terus terputus, coba hapus session dan login ulang

## Lisensi

MIT

## Credit

- Framework: [@roidev/kachina-md](https://github.com/idlanyor/kachina-core)
