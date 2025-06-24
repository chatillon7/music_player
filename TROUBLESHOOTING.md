# 🚨 Troubleshooting Guide - Production Setup

Bu rehber, **production-ready** müzik çalar uygulamasının kurulumu sırasında karşılaşabileceğiniz sorunları çözmek için hazırlanmıştır.

> 🎯 **Not**: Bu uygulama artık production-ready durumda olup, debug araçları kaldırılmıştır. Kurulum için bu rehberi takip edin.

## 🔴 Yaygın Kurulum Hataları

### ❌ "relation public.songs does not exist" Hatası

**Hata Mesajı:**
```
Failed to load songs: Error: Failed to fetch songs: relation "public.songs" does not exist
```

**✅ Çözüm:**
1. **Supabase Dashboard → SQL Editor** açın
2. `supabase/init.sql` dosyasının **tüm içeriğini** kopyalayın
3. SQL Editor'a yapıştırın ve **"Run"** tıklayın
4. Tablolar başarıyla oluşturulduğunu doğrulayın

### ❌ 401 Unauthorized Hatası

**Hata Mesajları:**
- "401 Unauthorized"
- "permission denied for table songs"
- "Failed to fetch songs"

**✅ Çözüm Adımları:**

#### 1️⃣ Veritabanı Tablolarını Kontrol Edin

**Supabase Dashboard → SQL Editor** açın ve şu kodu çalıştırın:

```sql
-- Diagnostic check
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'songs';
```

Eğer boş sonuç dönüyorsa, `supabase/quick-fix.sql` dosyasını çalıştırın.

#### 2️⃣ RLS Politikalarını Düzeltin

SQL Editor'da şu komutu çalıştırın:

```sql
-- Quick fix for RLS policies
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create public access policies
CREATE POLICY "Enable read access for all users" ON songs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON songs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON songs FOR DELETE USING (true);
```

#### 3️⃣ Storage Bucket Oluşturun

1. **Supabase Dashboard → Storage**
2. **"Create a new bucket"** tıklayın
3. Name: `music-files` (tam olarak bu isim)
4. **Public bucket: ✅ Mutlaka işaretleyin**
5. **"Create bucket"** tıklayın
6. **SQL Editor**'da `supabase/storage-setup.sql` dosyasını çalıştırın

#### 4️⃣ Environment Variables Kontrol

`.env.local` dosyanızda:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # 'eyJ' ile başlamalı
```

**⚠️ Önemli:** `service_role` key değil, `anon` key kullanın!

### 🔧 Adım Adım Kurulum Checklist

**✅ Kurulum Tamamlama Listesi:**

1. **[ ] Supabase Projesi Oluşturuldu**
   - [Supabase Dashboard](https://app.supabase.com/) açık
   - Yeni proje oluşturuldu

2. **[ ] Database Tabloları Kuruldu**
   - SQL Editor → `supabase/init.sql` çalıştırıldı
   - `SELECT * FROM songs;` komutu hata vermiyor

3. **[ ] Storage Bucket Oluşturuldu**
   - Storage → `music-files` bucket var
   - Public bucket ✅ aktif
   - `supabase/storage-setup.sql` çalıştırıldı

4. **[ ] Environment Variables Ayarlandı**
   - `.env.local` dosyası doğru
   - `NEXT_PUBLIC_SUPABASE_URL` doğru
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (eyJ ile başlıyor)

5. **[ ] Test Edildi**
   - `npm run build` başarılı
   - `npm run dev` çalışıyor
   - Ana sayfa açılıyor, hata yok

## 🛠️ Diğer Yaygın Sorunlar

### "Dosya Yüklenmiyor" Hatası
1. `music-files` bucket'ı var mı? ✅ Public mi?
2. `supabase/storage-setup.sql` çalıştırıldı mı?
3. Dosya boyutu 50MB'ın altında mı?
4. MP3 formatında mı?
5. Browser console'da hata var mı?

### "Şarkılar Çalmıyor" Hatası
1. Browser console'da Audio API hatası var mı?
2. Dosya URL'si browser'da açılıyor mu?
3. HTTPS üzerinden mi test ediyorsunuz?
4. iOS Safari'de ise dokunarak play butonuna basıldı mı?

### "PWA Yüklenmiyor" Hatası
1. HTTPS domain'de mi test ediyorsunuz?
2. `manifest.json` dosyası erişilebilir mi?
3. Service Worker aktif mi? (DevTools → Application → Service Workers)

## 🔍 Detaylı Tanı Yöntemleri

### Browser Console Kontrolü
1. **F12** ile Developer Tools açın
2. **Console** tab'ında hataları kontrol edin
3. **Network** tab'ında HTTP isteklerini kontrol edin
4. **Application** tab'ında PWA durumunu kontrol edin

### Supabase Bağlantı Testi
SQL Editor'da test komutları:

```sql
-- Tablolar var mı?
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Politikalar aktif mi?
SELECT * FROM pg_policies WHERE tablename = 'songs';

-- Storage bucket var mı?
SELECT * FROM storage.buckets WHERE name = 'music-files';
```

## ✅ Final Checklist

**Kurulum tamamen başarılı mı kontrol edin:**

- [ ] `npm run build` komutu başarılı
- [ ] Ana sayfada müzik listesi görünüyor (boş olabilir)
- [ ] Dosya yükleme alanı çalışıyor
- [ ] Konsol'da kritik hata yok
- [ ] Vercel'e deploy başarılı

**🎵 Tebrikler! Müzik çalarınız kullanıma hazır!**

## 🆘 Hala Sorun Var mı?

1. **Browser Console**: F12 → Console → Hata mesajlarını kontrol edin
2. **GitHub Issues**: [Sorun bildir](https://github.com/chatillon7/music_player/issues)
3. **Supabase Status**: [status.supabase.com](https://status.supabase.com/) kontrol edin
4. **Network**: HTTPS domain'de test edin

Bu rehberi takip ettikten sonra uygulamanız production-ready durumda çalışmaya hazır! 🎵

## 📊 Veritabanı Hatası: "relation public.songs does not exist"

### ❌ Hata:
```
Failed to load songs: Error: Failed to fetch songs: relation "public.songs" does not exist
```

### ✅ Çözüm:
Bu hata, Supabase veritabanınızda gerekli tabloların oluşturulmadığını gösterir.

**Adım 1:** Supabase Dashboard'a gidin
1. [Supabase Dashboard](https://app.supabase.com/) açın
2. Projenizi seçin
3. Sol menüden "SQL Editor" tıklayın

**Adım 2:** Veritabanı Tablolarını Oluşturun
1. SQL Editor'da yeni bir query açın
2. `supabase/init.sql` dosyasının tüm içeriğini kopyalayın
3. SQL Editor'a yapıştırın
4. "Run" butonuna tıklayın

**Adım 3:** Storage Bucket Oluşturun
1. Sol menüden "Storage" tıklayın
2. "Create a new bucket" tıklayın
3. Bucket name: `music-files`
4. Public bucket: ✅ İşaretleyin
5. "Create bucket" tıklayın

**Adım 4:** Storage Politikalarını Ayarlayın
1. SQL Editor'a geri dönün
2. `supabase/storage-setup.sql` dosyasının içeriğini çalıştırın

### 🔍 Doğrulama:
- SQL Editor'da `SELECT * FROM songs;` komutunu çalıştırın
- Hata almadan sonuç döndürüyorsa kurulum başarılı

## 🔑 API Key Hatası

### ❌ Hata:
```
Invalid URL
Supabase configuration is missing
```

### ✅ Çözüm:
Environment variables'ları kontrol edin.

**Adım 1:** Supabase Anahtarlarını Alın
1. Supabase Dashboard > Settings > API
2. Project URL'i kopyalayın
3. `anon public` key'i kopyalayın (service_role değil!)

**Adım 2:** .env.local Dosyasını Güncelleyin
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Önemli:** Service role key kullanmayın, sadece anon key kullanın!

## 🌐 Network/CORS Hatası

### ❌ Hata:
```
Failed to fetch
CORS error
```

### ✅ Çözüm:
**Adım 1:** Supabase Authentication ayarlarını kontrol edin
1. Supabase Dashboard > Authentication > Settings
2. Site URL: `http://localhost:3000` ekleyin
3. Redirect URLs: `http://localhost:3000/**` ekleyin

**Adım 2:** HTTPS üzerinden test edin
- Vercel'e deploy edin ve HTTPS URL'de test edin

## 📁 Dosya Yükleme Hatası

### ❌ Hata:
```
Upload failed
Storage bucket not found
```

### ✅ Çözüm:
**Adım 1:** Bucket'ın varlığını kontrol edin
1. Supabase Dashboard > Storage
2. `music-files` bucket'ı var mı kontrol edin

**Adım 2:** Bucket ayarlarını kontrol edin
1. Bucket'a tıklayın > Settings
2. Public bucket: ✅ Aktif olmalı
3. File size limit: 50MB veya daha fazla

**Adım 3:** RLS Politikalarını kontrol edin
SQL Editor'da çalıştırın:
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

## 🔄 Genel Sorun Giderme

### 1. Cache Temizleme
```bash
# Development cache'i temizle
rm -rf .next
npm run build
npm run dev
```

### 2. Dependency Sorunları
```bash
# Node modules'ü yenile
rm -rf node_modules package-lock.json
npm install
```

### 3. Environment Variables Kontrol
```bash
# Terminal'de kontrol edin
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Browser Developer Tools
1. F12 ile developer tools açın
2. Console tab'ında detaylı hata mesajlarını görün
3. Network tab'ında HTTP isteklerini kontrol edin

## 📞 Yardım

Sorun devam ediyorsa:
1. Browser console'dan tam hata mesajını kopyalayın
2. Supabase dashboard'da Database > Tables'ı kontrol edin
3. Storage > Buckets'ı kontrol edin
4. GitHub Issues'da sorun bildirebilirsiniz

---

**🎵 Production-Ready Music Player Troubleshooting Guide**

> Bu rehber ile kurulum sorunlarınızı çözebilir ve uygulamanızı hızla çalıştırabilirsiniz!
