# 🎵 Müzik Çalar - Music ## 🔍 Debug Tools & Sorun Giderme

**Built-in Debug Tools** ile kolay kurulum:

1. Uygulamayı başlatın: `npm run dev`
2. Ana sayfada **"Show Debug Tools"** butonuna tıklayın
3. **"Run Connection Tests"** ile otomatik tanı çalıştırın
4. Test sonuçlarındaki önerileri takip edin

Ayrıca detaylı sorun giderme için:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) dosyasına bakın
- 401 Unauthorized hatası ve diğer yaygın sorunların çözümleri mevcut

## 🚀 KurulumModern, mobil uyumlu müzik çalar uygulaması. Next.js 15, TypeScript, Supabase ve Bootstrap ile geliştirilmiştir.

## ✨ Özellikler

- 🎵 **MP3 Dosya Yükleme**: Herhangi bir yerden MP3 dosyalarını yükleyebilirsiniz
- 🎧 **Müzik Çalma**: Tam özellikli müzik çalar (çal, duraklat, ileri, geri)
- 🔀 **Karıştırma & Tekrar**: Şarkıları karıştırma ve tekrar çalma seçenekleri
- 🗑️ **Müzik Silme**: İstenmeyen şarkıları kolayca silebilirsiniz
- 📱 **Mobil Uyumlu**: iPhone ve Android cihazlarda mükemmel çalışır
- 🔊 **Arkaplan Çalma**: iOS'ta arkaplanda müzik çalmaya devam eder
- 📲 **PWA Desteği**: Ana ekrana uygulama olarak eklenebilir
- 🎨 **Modern UI**: Bootstrap ile şık ve kullanıcı dostu arayüz

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React
- **UI Framework**: Bootstrap 5, Bootstrap Icons
- **Veritabanı**: Supabase (PostgreSQL)
- **Dosya Depolama**: Supabase Storage
- **Ses API**: HTML5 Audio, Media Session API
- **PWA**: Next.js PWA desteği
- **Deployment**: Vercel

## � Sorun Giderme

Kurulum sırasında sorun yaşıyorsanız:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) dosyasına bakın
- Yaygın hatalar ve çözümleri burada bulabilirsiniz
- Özellikle "relation public.songs does not exist" hatası için çözümler mevcut

## �🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/username/music-player.git
cd music-player
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Supabase Kurulumu

1. [Supabase](https://supabase.com/) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Veritabanını kurmak için `supabase/init.sql` dosyasını çalıştırın
4. Storage bucket'ı oluşturun:
   - Bucket adı: `music-files`
   - Public access: Aktif

### 4. Çevre Değişkenleri
`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📱 Kullanım

### Müzik Yükleme
1. "Müzik Yükle" bölümünde dosya seçin veya sürükleyip bırakın
2. Sadece MP3 formatı desteklenir
3. Dosya otomatik olarak yüklenir ve listede görünür

### Müzik Çalma
1. Müzik listesinden herhangi bir şarkıya tıklayın
2. Alt kısımda müzik çalar açılır
3. Çal/duraklat, ileri/geri butonlarını kullanın
4. Ses seviyesini ayarlayın

### Özel Özellikler
- **Karıştırma**: Şarkıları rastgele sırayla çalar
- **Tekrar**: Tek şarkı veya tüm liste tekrarı
- **Arkaplan Çalma**: iOS'ta Safari'den çıkınca bile müzik devam eder

## 🌐 Deployment

### Vercel'e Deploy Etme
1. [Vercel](https://vercel.com/) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Çevre değişkenlerini Vercel dashboard'da ekleyin
4. Otomatik deploy edilir

### Supabase Ayarları
- Database URL'i production için güncelleyin
- Storage bucket'ın public erişimini kontrol edin
- RLS (Row Level Security) politikalarını ayarlayın

## 📂 Proje Yapısı

```
music-player/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Ana layout
│   │   ├── page.tsx            # Ana sayfa
│   │   └── globals.css         # Global stiller
│   ├── components/
│   │   ├── MusicPlayer.tsx     # Müzik çalar bileşeni
│   │   ├── SongList.tsx        # Şarkı listesi
│   │   └── SongUpload.tsx      # Dosya yükleme
│   └── lib/
│       └── supabase.ts         # Supabase yapılandırması
├── public/
│   └── manifest.json           # PWA manifest
├── supabase/
│   └── init.sql                # Veritabanı şeması
└── README.md
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. `src/components/` dizinine yeni bileşenler ekleyin
2. Supabase işlemleri için `src/lib/supabase.ts` dosyasını güncelleyin
3. UI güncellemeleri için Bootstrap sınıflarını kullanın

### Mobil Test Etme
- Chrome DevTools'ta mobil görünümü test edin
- Gerçek iOS/Android cihazlarda test edin
- PWA kurulumunu test edin

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Yeni özellik branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🎯 Roadmap

- [ ] Playlist oluşturma ve yönetimi
- [ ] Şarkı meta verileri düzenleme
- [ ] Gelişmiş arama ve filtreleme
- [ ] Tema özelleştirme
- [ ] Spotify/Apple Music entegrasyonu
- [ ] Sosyal paylaşım özellikleri

## 📞 İletişim

Sorularınız ve önerileriniz için:
- GitHub Issues
- Email: your-email@example.com

---

Made with ❤️ by [Your Name]
