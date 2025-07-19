# Oxiva Store - E-Commerce Website

Modern ve güvenli bir e-ticaret sitesi. Next.js 15, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- 🛒 Modern e-ticaret deneyimi
- 💳 PayTR ödeme gateway entegrasyonu
- 📱 Tam responsive tasarım
- 🔒 Güvenli ödeme altyapısı
- 🚀 Yüksek performans
- 📦 Ürün yönetimi
- 🎨 Modern UI/UX

## Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd oxiva-store
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
cp .env.local.example .env.local
```

4. `.env.local` dosyasını düzenleyin:
```env
# PayTR API Credentials
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt

# Site URLs
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Geliştirme

Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Production Build

1. Production build oluşturun:
```bash
npm run build
```

2. Production sunucusunu başlatın:
```bash
npm start
```

## Deployment

### Vercel (Önerilen)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub reposunu Vercel'e bağlayın
3. Çevre değişkenlerini Vercel dashboard'dan ekleyin
4. Deploy edin

### Manuel Deployment

1. Build oluşturun:
```bash
npm run build
```

2. `.next`, `public`, `package.json` ve `node_modules` klasörlerini sunucuya yükleyin

3. PM2 ile çalıştırın:
```bash
npm install -g pm2
pm2 start npm --name "oxiva-store" -- start
```

## PayTR Entegrasyonu

1. [PayTR](https://www.paytr.com) hesabı oluşturun
2. Merchant bilgilerinizi alın
3. PayTR panelinden callback URL'lerini ayarlayın:
   - Success URL: `https://yourdomain.com/payment/success`
   - Fail URL: `https://yourdomain.com/payment/fail`
   - Callback URL: `https://yourdomain.com/api/payment/callback`

## Güvenlik

- Tüm hassas bilgiler çevre değişkenlerinde saklanır
- HTTPS kullanımı zorunludur
- PayTR hash doğrulaması yapılır
- Input validasyonları mevcuttur

## Lisans

Tüm hakları saklıdır.