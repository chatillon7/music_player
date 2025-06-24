# 🎵 Müzik Çalar - Music Player

Modern, mobil uyumlu müzik çalar uygulaması. Next.js 15, TypeScript, Supabase ve Bootstrap ile geliştirilmiştir.

![Music Player Screenshot](./public/screenshot.png)

> 🎯 **Production Ready** - Tamamen test edilmiş ve kullanıma hazır!

## ✨ Özellikler

- 🎵 **MP3 Dosya Yükleme**: Herhangi bir yerden MP3 dosyalarını sürükle-bırak ile yükleyin
- 🎧 **Gelişmiş Müzik Çalar**: Tam özellikli kontroller (çal, duraklat, ileri, geri)
- 🔀 **Karıştırma & Tekrar**: Şarkıları karıştırma ve tekrar çalma seçenekleri
- ⌨️ **Klavye Desteği**: Windows medya tuşları ile kontrol (Play/Pause, Next, Previous, Stop)
- 📱 **Mobil Uyumlu**: iPhone ve Android cihazlarda mükemmel performans
- 🔊 **Arkaplan Çalma**: iOS'ta arkaplanda müzik çalmaya devam eder
- 🎵 **iOS Autoplay**: İlk etkileşimden sonra şarkı geçişlerinde otomatik çalma
- 📲 **PWA Desteği**: Ana ekrana uygulama olarak eklenebilir
- 🎨 **Modern Dark UI**: Turuncu tema ile şık ve kullanıcı dostu arayüz
- 🔒 **Güvenli**: Admin-only silme işlemleri, production-ready güvenlik

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React
- **UI Framework**: Bootstrap 5, Bootstrap Icons
- **Tema**: Dark theme (#1e1e1e) with Orange primary (#ff9230)
- **Veritabanı**: Supabase (PostgreSQL)
- **Dosya Depolama**: Supabase Storage
- **Ses API**: HTML5 Audio, Media Session API
- **PWA**: Service Worker ile arkaplan desteği
- **Deployment**: Vercel optimized

## 🔍 Sorun Giderme

Kurulum sırasında sorun yaşıyorsanız:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) dosyasına bakın
- Yaygın hatalar ve adım adım çözümler
- Supabase kurulum rehberi ve SQL script'lerinin çalıştırılması

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/chatillon7/music_player.git
cd music_player
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Supabase Kurulumu

1. [Supabase](https://supabase.com/) hesabı oluşturun
2. Yeni bir proje oluşturun
3. **SQL Editor**'da `supabase/init.sql` dosyasının tüm içeriğini çalıştırın
4. **Storage** bölümünden bucket oluşturun:
   - Bucket adı: `music-files`
   - Public access: ✅ Aktif edin
5. **SQL Editor**'da `supabase/storage-setup.sql` dosyasını çalıştırın

> 📋 **Not**: Tüm SQL script'leri `supabase/` klasöründe mevcuttur.

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
1. Ana sayfada "Müzik Yükle" bölümüne dosyaları sürükleyin
2. Veya "Dosya Seç" butonuna tıklayarak seçin
3. Sadece MP3 formatı desteklenir
4. Dosya otomatik olarak yüklenir ve listede görünür

### Müzik Çalma
1. Müzik listesinden herhangi bir şarkıya tıklayın
2. Alt kısımda müzik çalar otomatik açılır ve çalmaya başlar
3. Çal/duraklat, ileri/geri butonlarını kullanın
4. İlerleme çubuğundan istediğiniz konuma atlayın

### Özel Özellikler
- **🔀 Karıştırma**: Şarkıları rastgele sırayla çalar
- **🔁 Tekrar**: Tek şarkı veya tüm liste tekrarı
- **⌨️ Klavye Kontrolleri**: Windows medya tuşları (Play/Pause, Next, Previous, Stop)
- **🔊 Arkaplan Çalma**: iOS'ta Safari'den çıkınca bile müzik devam eder
- **📱 PWA**: Ana ekrana ekleyerek native app gibi kullanın

## 📱 iOS & Mobile Özellikleri

### iOS Autoplay Desteği
- **İlk Etkileşim**: Kullanıcı ilk kez play butonuna bastığında iOS autoplay kısıtlaması kaldırılır
- **Otomatik Geçiş**: Şarkı bitiminde veya next/previous butonlarında otomatik çalma aktif olur
- **Şarkı Seçimi**: Listeden şarkı seçiminde otomatik başlatma (ilk etkileşimden sonra)
- **Arkaplan Çalma**: Media Session API ile iOS'ta arkaplanda çalmaya devam eder

### PWA (Progressive Web App)
- Ana ekrana uygulama olarak eklenebilir (iOS Safari: Share → Add to Home Screen)
- Native uygulama benzeri deneyim
- Offline cache desteği (service worker ile)
- Dark theme ile iOS dark mode uyumlu

### Klavye Desteği
- **Play/Pause**: Media Play/Pause tuşu
- **Next Track**: Media Next tuşu  
- **Previous Track**: Media Previous tuşu
- **Stop**: Media Stop tuşu

## 🌐 Deployment

### Vercel'e Deploy Etme
1. [Vercel](https://vercel.com/) hesabı oluşturun
2. GitHub repository'nizi bağlayın (`https://github.com/chatillon7/music_player`)
3. Environment variables'ları Vercel dashboard'da ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Deploy butonu ile otomatik deployment başlar

### Production Checklist
- ✅ Supabase database kurulumu tamamlandı
- ✅ Storage bucket (`music-files`) oluşturuldu
- ✅ Environment variables Vercel'de ayarlandı
- ✅ HTTPS domain üzerinden test edildi
- ✅ Mobile/iOS compatibility test edildi

## 📂 Proje Yapısı

```
music_player/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Ana layout ve PWA config
│   │   ├── page.tsx            # Ana sayfa
│   │   └── globals.css         # Dark theme styles
│   ├── components/
│   │   ├── MusicPlayer.tsx     # Müzik çalar (Media Session API)
│   │   ├── SongList.tsx        # Şarkı listesi
│   │   └── SongUpload.tsx      # Drag & drop upload
│   └── lib/
│       ├── supabase.ts         # Supabase client & services
│       └── errors.ts           # Error handling
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── icons/                  # PWA icons
├── supabase/
│   ├── init.sql                # Database schema
│   └── storage-setup.sql       # Storage policies
└── .github/
    └── copilot-instructions.md # Development guidelines
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

### Completed ✅
- [x] MP3 upload with drag & drop
- [x] Music player with all controls
- [x] Shuffle and repeat modes
- [x] Windows media keyboard support
- [x] iOS background playback
- [x] PWA support with service worker
- [x] Dark theme with orange accent
- [x] Mobile-first responsive design
- [x] Production-ready security (admin-only deletes)

### Future Enhancements 🚀
- [ ] Playlist oluşturma ve yönetimi
- [ ] Şarkı meta verileri düzenleme (ID3 tags)
- [ ] Gelişmiş arama ve filtreleme
- [ ] Tema özelleştirme seçenekleri
- [ ] Spotify/Apple Music entegrasyonu
- [ ] Sosyal paylaşım özellikleri
- [ ] Offline mode support

## 📞 İletişim

Sorularınız ve önerileriniz için:
- GitHub Issues: [music_player/issues](https://github.com/chatillon7/music_player/issues)
- Repository: [github.com/chatillon7/music_player](https://github.com/chatillon7/music_player)

---

**🎵 Made with ❤️ for music lovers**

> Bu proje production-ready durumda ve aktif olarak kullanılmaktadır!
