# 🚨 Troubleshooting Guide - 401 Unauthorized Fix

Bu rehber, **401 Unauthorized** hatasını ve diğer yaygın sorunları çözmek için hazırlanmıştır.

## 🔴 401 Unauthorized Hatası

### ❌ Hata Mesajları:
- "401 Unauthorized"
- "permission denied for table songs"
- "Failed to fetch songs"

### 🕵️ Tanı Araçları

Uygulamanın ana sayfasında **"Show Debug Tools"** butonuna tıklayın ve **"Run Connection Tests"** ile hatanın nedenini tespit edin.

### ✅ Çözüm Adımları:

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
3. Name: `music-files`
4. **Public bucket: ✅ İşaretleyin**
5. **"Create bucket"** tıklayın

#### 4️⃣ Environment Variables Kontrol

`.env.local` dosyanızda:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # 'eyJ' ile başlamalı
```

**⚠️ Önemli:** `service_role` key değil, `anon` key kullanın!

### 🔧 Hızlı Kurulum Scripti

Tüm sorunları tek seferde çözmek için:

1. `supabase/diagnostic.sql` - Mevcut durumu kontrol et
2. `supabase/quick-fix.sql` - Tabloları ve politikaları oluştur
3. Storage bucket'ı manuel oluştur
4. `supabase/storage-setup.sql` - Storage politikalarını ayarla

## 🛠️ Diğer Yaygın Sorunlar

### "Table does not exist" Hatası
```bash
# Çözüm: supabase/init.sql dosyasını çalıştırın
```

### Dosya Yükleme Başarısız
1. `music-files` bucket'ı var mı?
2. Storage politikaları kuruldu mu?
3. Dosya boyutu 50MB'ın altında mı?
4. MP3 formatında mı?

### Şarkılar Çalmıyor
1. Browser console'da hata var mı?
2. Dosya URL'si erişilebilir mi?
3. MP3 dosyası bozuk olmayabilir mi?

## 🎯 Debug Tools Kullanımı

1. Ana sayfada **"Show Debug Tools"** tıklayın
2. **"Run Connection Tests"** ile testleri çalıştırın
3. Her test sonucunda önerilen çözümleri uygulayın

## ✅ Kurulum Checklist

- [ ] `supabase/diagnostic.sql` çalıştırıldı
- [ ] Tablolar oluşturuldu (`songs` tablosu var)
- [ ] RLS politikaları ayarlandı
- [ ] `music-files` bucket oluşturuldu (public)
- [ ] Storage politikaları kuruldu
- [ ] `.env.local` doğru anon key içeriyor
- [ ] Debug tools tüm testlerden geçiyor

## 🆘 Hala Sorun Var mı?

1. Browser console'daki hata mesajlarını kontrol edin
2. Debug tools'un detaylı raporunu inceleyin
3. Supabase projenizin aktif olduğunu doğrulayın
4. Supabase dashboard'da servis durumunu kontrol edin

Bu rehberi takip ettikten sonra debug tools ile test yapın. Tüm testler geçiyorsa uygulamanız çalışmaya hazır! 🎵

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

Bu rehberle çoğu kurulum sorunu çözülecektir! 🎵
