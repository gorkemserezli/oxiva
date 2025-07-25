import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Mesaj şablonları
const messageTemplates = {
  welcome: `🎉 *Oxiva Store'a Hoş Geldiniz!*

Merhaba! Size nasıl yardımcı olabilirim?

1️⃣ *Sipariş vermek*
2️⃣ *Ürün bilgisi*
3️⃣ *Fiyat öğrenmek*
4️⃣ *Destek*

Lütfen bir numara yazın veya sorunuzu sorun.`,

  productInfo: `🔍 *Oxiva Mıknatıslı Burun Bandı*

✅ Horlama ve uyku apnesine karşı etkili
✅ Rahat nefes alma sağlar
✅ Yumuşak medikal silikon
✅ Tek kullanımlık hijyenik

💰 *Fiyat:* 449₺
🚚 *Ücretsiz Kargo*

Sipariş vermek için "1" yazın.`,

  orderStart: `📦 *Sipariş Oluşturma*

Kaç adet almak istersiniz?

1️⃣ 1 Adet - 449₺
2️⃣ 2 Adet - 798₺ (100₺ indirim!)
3️⃣ 3 Adet - 1197₺ (150₺ indirim!)
4️⃣ Daha fazla

Lütfen adet seçin:`,

  askInfo: `📝 *Müşteri Bilgileri*

Lütfen aşağıdaki bilgileri gönderin:

*Ad Soyad:*
*Telefon:*
*Adres:*
*İl/İlçe:*

Örnek:
_Ahmet Yılmaz_
_0555 123 45 67_
_Atatürk Mah. Cumhuriyet Cad. No:123_
_İstanbul/Kadıköy_`
};

// Sipariş durumu saklama (production'da veritabanı kullanılmalı)
const orderSessions = new Map();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Twilio'dan gelen verileri al
    const from = formData.get('From') as string; // Müşteri numarası
    const body = formData.get('Body') as string; // Mesaj içeriği
    const profileName = formData.get('ProfileName') as string; // WhatsApp profil ismi
    
    console.log('WhatsApp mesajı alındı:', { from, body, profileName });
    
    // Session kontrolü
    let session = orderSessions.get(from) || { state: 'new' };
    let responseMessage = '';
    
    // Mesaj içeriğini küçük harfe çevir
    const message = body.toLowerCase().trim();
    
    // Ana menü seçimleri
    if (session.state === 'new' || message === 'menu' || message === 'menü') {
      if (message === '1' || message.includes('sipariş')) {
        session.state = 'ordering';
        responseMessage = messageTemplates.orderStart;
      } else if (message === '2' || message.includes('ürün')) {
        responseMessage = messageTemplates.productInfo;
      } else if (message === '3' || message.includes('fiyat')) {
        responseMessage = messageTemplates.productInfo;
      } else if (message === '4' || message.includes('destek')) {
        responseMessage = `📞 *Destek Hattı*\n\nTelefon: 0850 123 45 67\nE-posta: info@oxiva.com\n\nMesai Saatleri: 09:00 - 18:00`;
      } else {
        responseMessage = messageTemplates.welcome;
      }
    }
    
    // Sipariş akışı
    else if (session.state === 'ordering') {
      if (['1', '2', '3', '4'].includes(message)) {
        session.quantity = parseInt(message);
        session.state = 'collecting_info';
        responseMessage = messageTemplates.askInfo;
      } else if (message.includes('adet')) {
        const match = message.match(/(\d+)/);
        if (match) {
          session.quantity = parseInt(match[1]);
          session.state = 'collecting_info';
          responseMessage = messageTemplates.askInfo;
        }
      }
    }
    
    // Müşteri bilgileri toplama
    else if (session.state === 'collecting_info') {
      // Basit bir parse - production'da daha gelişmiş olmalı
      const lines = body.split('\n').filter(line => line.trim());
      if (lines.length >= 4) {
        session.customerInfo = {
          name: lines[0],
          phone: lines[1],
          address: lines[2],
          city: lines[3]
        };
        session.state = 'confirming';
        
        const price = session.quantity === 1 ? 449 : 
                     session.quantity === 2 ? 798 : 
                     session.quantity === 3 ? 1197 : 
                     session.quantity * 399;
        
        responseMessage = `✅ *Sipariş Özeti*

📦 ${session.quantity} adet Oxiva
💰 Toplam: ${price}₺
🚚 Ücretsiz Kargo

*Teslimat Bilgileri:*
${session.customerInfo.name}
${session.customerInfo.phone}
${session.customerInfo.address}
${session.customerInfo.city}

Onaylıyor musunuz? (Evet/Hayır)`;
      } else {
        responseMessage = `❌ Lütfen tüm bilgileri eksiksiz gönderin:\n\n${messageTemplates.askInfo}`;
      }
    }
    
    // Sipariş onaylama
    else if (session.state === 'confirming') {
      if (message === 'evet' || message === 'e' || message === 'onay') {
        // Siparişi kaydet (production'da veritabanına)
        const orderId = `OX${Date.now().toString().slice(-8)}`;
        
        // TODO: Siparişi veritabanına kaydet
        // TODO: Admin paneline bildirim gönder
        
        responseMessage = `🎉 *Siparişiniz Alındı!*

Sipariş No: ${orderId}

✅ Siparişiniz onaylandı
📞 En kısa sürede aranacaksınız
💳 Ödeme kapıda nakit/kredi kartı

Bizi tercih ettiğiniz için teşekkürler! 🙏`;
        
        // Session'ı temizle
        orderSessions.delete(from);
      } else if (message === 'hayır' || message === 'h' || message === 'iptal') {
        responseMessage = `❌ Sipariş iptal edildi.\n\nTekrar sipariş vermek için "1" yazabilirsiniz.`;
        session.state = 'new';
      }
    }
    
    // Session'ı güncelle
    if (session.state !== 'new') {
      orderSessions.set(from, session);
    }
    
    // Twilio webhook response formatı
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;
    
    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Üzgünüz, bir hata oluştu. Lütfen daha sonra tekrar deneyin.</Message>
</Response>`;
    
    return new NextResponse(errorTwiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Twilio webhook doğrulaması için GET endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'WhatsApp Webhook is ready',
    instructions: 'Configure this URL in Twilio Console: https://yourdomain.com/api/whatsapp/webhook'
  });
}