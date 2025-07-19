'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kullanım Koşulları
            </h1>
            <p className="text-lg text-gray-600">
              Web sitemizi kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto prose prose-lg"
          >
            <p className="text-gray-600 mb-8">
              <strong>Son Güncelleme:</strong> 01.01.2024
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
            <p className="text-gray-600 mb-6">
              Bu web sitesi Oxiva tarafından işletilmektedir. Web sitemizi kullanarak, 
              aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Bu koşulları kabul 
              etmiyorsanız, lütfen sitemizi kullanmayınız.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Site Kullanımı</h2>
            <p className="text-gray-600 mb-4">
              Web sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Yasal olmayan hiçbir amaç için kullanmamak</li>
              <li>Diğer kullanıcıların haklarını ihlal etmemek</li>
              <li>Site güvenliğini tehdit edecek davranışlarda bulunmamak</li>
              <li>Yanıltıcı veya yanlış bilgi paylaşmamak</li>
              <li>Fikri mülkiyet haklarına saygı göstermek</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Ürün Bilgileri ve Fiyatlar</h2>
            <p className="text-gray-600 mb-6">
              Web sitemizde yer alan ürün bilgileri ve fiyatlar hakkında:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Ürün bilgileri mümkün olduğunca doğru ve güncel tutulmaktadır</li>
              <li>Fiyatlar KDV dahil olarak gösterilmektedir</li>
              <li>Stok durumu anlık olarak güncellenmektedir</li>
              <li>Teknik hatalardan kaynaklanan yanlışlıklar için sorumluluk kabul edilmez</li>
              <li>Fiyat değişikliği yapma hakkımız saklıdır</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sipariş ve Teslimat</h2>
            <p className="text-gray-600 mb-6">
              Sipariş ve teslimat süreçleri ile ilgili koşullar:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Siparişler stok durumuna göre işleme alınır</li>
              <li>Sipariş onayı e-posta ile gönderilir</li>
              <li>Teslimat süresi 1-3 iş günüdür</li>
              <li>Kargo ücreti alınmamaktadır</li>
              <li>Teslimat adresi değişiklikleri kargo verilmeden önce yapılmalıdır</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Ödeme Koşulları</h2>
            <p className="text-gray-600 mb-6">
              Ödemeler ile ilgili kurallar:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Kredi kartı ile güvenli ödeme yapılabilir</li>
              <li>Tüm kartlar 3D Secure ile korunmaktadır</li>
              <li>Kart bilgileriniz tarafımızda saklanmaz</li>
              <li>Ödeme alındıktan sonra sipariş işleme alınır</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. İade ve İptal</h2>
            <p className="text-gray-600 mb-6">
              İade ve iptal koşulları:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>30 gün içinde iade hakkınız bulunmaktadır</li>
              <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
              <li>İade kargo ücreti tarafımızdan karşılanır</li>
              <li>İade onaylandıktan sonra 3-5 iş günü içinde ödeme iadesi yapılır</li>
              <li>Kargo verilmeden önce sipariş iptali yapılabilir</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Fikri Mülkiyet Hakları</h2>
            <p className="text-gray-600 mb-6">
              Web sitemizde yer alan tüm içerikler (yazılar, görseller, logo, tasarım) 
              Oxiva&apos;ya aittir ve telif hakları ile korunmaktadır. İzinsiz kullanım, 
              kopyalama veya dağıtım yasaktır.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sorumluluk Sınırlaması</h2>
            <p className="text-gray-600 mb-6">
              Oxiva, web sitesinin kullanımından doğabilecek doğrudan veya dolaylı 
              zararlardan sorumlu tutulamaz. Site içeriğinin doğruluğu konusunda 
              azami özen gösterilmekle birlikte, hatalardan sorumluluk kabul edilmez.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Gizlilik</h2>
            <p className="text-gray-600 mb-6">
              Kişisel verilerinizin korunması ile ilgili detaylı bilgi için 
              <a href="/privacy" className="text-primary-500 hover:underline ml-1">
                Gizlilik Politikamızı
              </a> inceleyebilirsiniz.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Değişiklikler</h2>
            <p className="text-gray-600 mb-6">
              Oxiva, bu kullanım koşullarını önceden haber vermeksizin değiştirme 
              hakkını saklı tutar. Değişiklikler web sitesinde yayınlandığı tarihte 
              yürürlüğe girer.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Uygulanacak Hukuk</h2>
            <p className="text-gray-600 mb-6">
              Bu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir. 
              Doğabilecek ihtilaflarda İstanbul mahkemeleri ve icra daireleri yetkilidir.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. İletişim</h2>
            <p className="text-gray-600 mb-6">
              Kullanım koşulları hakkında sorularınız için:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600">
                <strong>E-posta:</strong> info@oxiva.com<br />
                <strong>Telefon:</strong> 0850 XXX XX XX<br />
                <strong>Adres:</strong> İstanbul, Türkiye
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}