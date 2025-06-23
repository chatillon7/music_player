# Deployment Rehberi

Bu rehber, müzik çalar uygulamasını Vercel'de deploy etmek için gerekli adımları içerir.

## 🚀 Vercel'e Deploy Etme

### 1. Vercel Hesabı Oluşturma
1. [Vercel.com](https://vercel.com/) adresine gidin
2. GitHub hesabınızla giriş yapın
3. Yeni proje oluşturun

### 2. GitHub Repository Oluşturma
```bash
# Git repository başlatın
git init

# Dosyaları ekleyin
git add .

# İlk commit
git commit -m "Initial commit: Music Player App"

# GitHub'da repository oluşturun ve remote ekleyin
git remote add origin https://github.com/username/music-player.git

# Push yapın
git push -u origin main
```

### 3. Vercel'de Proje Kurulumu
1. Vercel dashboard'da "New Project" tıklayın
2. GitHub repository'nizi seçin
3. Build ayarlarını kontrol edin:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4. Environment Variables Ekleme
Vercel dashboard'da şu çevre değişkenlerini ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Domain Ayarları
- Vercel otomatik bir domain verir: `your-app.vercel.app`
- Özel domain eklemek için "Domains" sekmesini kullanın
- SSL sertifikası otomatik olarak eklenir

## 🗄️ Supabase Kurulumu

### 1. Supabase Projesi Oluşturma
1. [Supabase.com](https://supabase.com/) hesabı oluşturun
2. Yeni proje oluşturun
3. Proje URL'i ve anon key'i kopyalayın

### 2. Veritabanı Kurulumu
1. Supabase dashboard'da "SQL Editor" açın
2. `supabase/init.sql` dosyasındaki kodları çalıştırın
3. Tablolar ve indexler oluşturulacak

### 3. Storage Kurulumu
1. "Storage" sekmesine gidin
2. Yeni bucket oluşturun: `music-files`
3. Bucket ayarlarını açın:
   - Public bucket: ✅ Aktif
   - File size limit: 50MB (veya isteğinize göre)
4. Bucket politikalarını ayarlayın:

```sql
-- Insert policy
CREATE POLICY "Enable insert for all users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'music-files');

-- Select policy  
CREATE POLICY "Enable read access for all users" ON storage.objects
FOR SELECT USING (bucket_id = 'music-files');

-- Delete policy
CREATE POLICY "Enable delete for all users" ON storage.objects
FOR DELETE USING (bucket_id = 'music-files');
```

### 4. RLS (Row Level Security) Ayarları
```sql
-- Songs tablosu için RLS politikaları
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON songs
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON songs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON songs
FOR DELETE USING (true);
```

## 📱 PWA Ayarları

### 1. Icon Dosyaları
`public/` klasörüne şu dosyaları ekleyin:
- `icon-192x192.png` (192x192 px) - şu anda SVG placeholder mevcut
- `icon-512x512.png` (512x512 px) - şu anda SVG placeholder mevcut
- `favicon.ico`

**Not**: Şu anda SVG placeholder iconlar mevcut. Production için PNG formatında gerçek iconlar eklemeniz önerilir.

### 2. iOS Safari Ayarları
Zaten layout.tsx dosyasında eklenmiş:
- Apple touch icon
- Web app capable
- Status bar style

### 3. Android Chrome Ayarları
Manifest.json dosyası zaten hazır:
- Theme color
- Background color
- Display mode: standalone

## 🔧 Production Optimizasyonları

### 1. Next.js Ayarları
`next.config.ts` dosyasında:
- PWA cache stratejileri
- Image optimization
- Security headers

### 2. Performance
- Service Worker otomatik olarak oluşturulur
- Static assets cache edilir
- Audio dosyaları efficient şekilde serve edilir

### 3. SEO
- Meta tags layout.tsx'da tanımlanmış
- Manifest.json PWA için hazır
- Sitemap gerekirse eklenebilir

## 🚨 Güvenlik

### 1. Supabase Security
- RLS politikalarını aktif tutun
- API key'leri güvenli saklayın
- Gereksiz permissions vermeyin

### 2. Vercel Security
- Environment variables güvenli
- HTTPS otomatik aktif
- Security headers vercel.json'da tanımlı

## 📊 Monitoring

### 1. Vercel Analytics
- Otomatik performance monitoring
- Error tracking
- User analytics

### 2. Supabase Monitoring
- Database performance
- Storage usage
- API calls tracking

## 🔄 Updates

### 1. Otomatik Deploy
- GitHub'a push yaptığınızda otomatik deploy
- Preview deployments for branches
- Production deployment for main branch

### 2. Database Migrations
- Yeni tablolar için SQL Editor kullanın
- Backup alın before major changes
- Test environment kullanın

---

Bu rehber ile müzik çalar uygulamanız production'da çalışır durumda olacaktır! 🎵
