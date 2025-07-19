'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
              Gizlilik Politikası
            </h1>
            <p className="text-lg text-gray-600">
              Kişisel verilerinizin güvenliği bizim için önemlidir.
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

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
            <p className="text-gray-600 mb-6">
              Oxiva olarak, müşterilerimizin kişisel verilerinin korunması konusunda azami hassasiyet göstermekteyiz. 
              Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde ve ürünlerimizi satın aldığınızda toplanan 
              kişisel verilerinizin nasıl işlendiğini açıklamaktadır.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
            <p className="text-gray-600 mb-4">
              Web sitemizi kullanırken aşağıdaki bilgiler toplanabilir:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Ad, soyad</li>
              <li>E-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Teslimat ve fatura adresi</li>
              <li>TC Kimlik numarası (fatura düzenleme için)</li>
              <li>Ödeme bilgileri (kredi kartı bilgileriniz tarafımızda saklanmaz)</li>
              <li>IP adresi ve tarayıcı bilgileri</li>
              <li>Çerezler aracılığıyla toplanan bilgiler</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanım Amaçları</h2>
            <p className="text-gray-600 mb-4">
              Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Siparişlerinizin işlenmesi ve teslimatı</li>
              <li>Müşteri hizmetleri desteğinin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Ürün ve hizmetlerimizin geliştirilmesi</li>
              <li>İzniniz dahilinde pazarlama faaliyetleri</li>
              <li>Web sitesi deneyiminin iyileştirilmesi</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bilgilerin Paylaşılması</h2>
            <p className="text-gray-600 mb-6">
              Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmamaktadır. 
              Ancak aşağıdaki durumlarda sınırlı paylaşım yapılabilir:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Kargo firmaları (teslimat için)</li>
              <li>Ödeme altyapı sağlayıcıları</li>
              <li>Yasal merciler (kanuni zorunluluk halinde)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h2>
            <p className="text-gray-600 mb-6">
              Kişisel verilerinizin güvenliği için endüstri standardı güvenlik önlemleri alınmaktadır:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>256-bit SSL şifreleme</li>
              <li>Güvenli sunucu altyapısı</li>
              <li>Düzenli güvenlik güncellemeleri</li>
              <li>Erişim kontrolleri</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler</h2>
            <p className="text-gray-600 mb-6">
              Web sitemizde deneyiminizi iyileştirmek için çerezler kullanılmaktadır. 
              Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz, ancak bu durumda 
              site özelliklerinin bir kısmı düzgün çalışmayabilir.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Haklarınız</h2>
            <p className="text-gray-600 mb-4">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verileriniz hakkında bilgi talep etme</li>
              <li>Verilerin işlenme amacını öğrenme</li>
              <li>Verilerin yurt içi veya yurt dışına aktarılıp aktarılmadığını öğrenme</li>
              <li>Verilerin düzeltilmesini veya silinmesini talep etme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi sonucu aleyhinize çıkan sonuca itiraz etme</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. İletişim</h2>
            <p className="text-gray-600 mb-6">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600">
                <strong>E-posta:</strong> info@oxiva.com<br />
                <strong>Telefon:</strong> 0850 XXX XX XX<br />
                <strong>Adres:</strong> İstanbul, Türkiye
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Değişiklikler</h2>
            <p className="text-gray-600 mb-6">
              Bu gizlilik politikası zaman zaman güncellenebilir. 
              Değişiklikler web sitemizde yayınlandığı tarihte yürürlüğe girer.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}