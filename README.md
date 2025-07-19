# Oxiva Store - Mıknatıslı Burun Bandı E-Ticaret Sitesi

Modern ve kullanıcı dostu tek ürün satış sitesi. Next.js 15, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ Modern ve responsive tasarım
- ✅ SEO optimizasyonu
- ✅ Hızlı yükleme süreleri
- ✅ Güvenli ödeme altyapısı
- ✅ WhatsApp entegrasyonu
- ✅ Dinamik fiyatlandırma
- ✅ Stok takibi
- ✅ Ürün zoom özelliği

## 🛠️ Teknolojiler

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Styling:** Tailwind CSS
- **Animasyonlar:** Framer Motion
- **İkonlar:** Lucide React
- **State Management:** React Context API

## 📦 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/[kullanıcı-adı]/oxiva-store.git

# Proje klasörüne girin
cd oxiva-store

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
oxiva-store/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Ana layout
│   ├── page.tsx           # Ana sayfa
│   ├── product/           # Ürün detay sayfası
│   ├── checkout/          # Ödeme sayfası
│   └── success/           # Başarılı sipariş sayfası
├── components/            # React componentleri
│   ├── layout/           # Header, Footer
│   ├── sections/         # Sayfa bölümleri
│   └── ui/              # UI componentleri
├── context/              # React Context
├── public/               # Statik dosyalar
└── styles/               # Global stiller
```

## 🎨 Özelleştirme

### Renkler
Renkleri `tailwind.config.ts` dosyasından özelleştirebilirsiniz:

```javascript
colors: {
  primary: {
    500: '#2C4E70', // Ana renk
  },
  accent: {
    500: '#5BA4D3', // Vurgu rengi
  }
}
```

### İletişim Bilgileri
WhatsApp numarasını ve diğer iletişim bilgilerini ilgili component'lerde güncelleyin.

## 🚀 Deployment

### Vercel ile Deploy

```bash
npm run build
vercel --prod
```

### Manuel Build

```bash
npm run build
npm start
```

## 📝 Yapılacaklar

- [ ] Gerçek ödeme gateway entegrasyonu
- [ ] Email bildirimleri
- [ ] Admin paneli
- [ ] Çoklu dil desteği
- [ ] Ürün varyantları

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

## 📞 İletişim

- Website: [oxiva.com](https://oxiva.com)
- Email: info@oxiva.com
- WhatsApp: +90 5XX XXX XX XX

---

💙 [Oxiva](https://oxiva.com) tarafından geliştirilmiştir.