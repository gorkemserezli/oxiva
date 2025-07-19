'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: "Oxiva mıknatıslı burun bandı nasıl çalışır?",
    answer: "Oxiva, burun deliklerinizin dış kısmına yerleştirilen mıknatıslar sayesinde burun yollarınızı nazikçe açar. Bu sayede hava akışı artar ve horlama problemi azalır. Medikal silikon malzemesi cildinize zarar vermez."
  },
  {
    question: "Ürün her burun tipine uygun mu?",
    answer: "Evet, Oxiva esnek yapısı sayesinde her burun tipine uyum sağlar. Mıknatıslar ayarlanabilir olduğu için küçük veya büyük burunlarda rahatlıkla kullanılabilir."
  },
  {
    question: "Ne kadar süre kullanabilirim?",
    answer: "Oxiva yıkanabilir ve tekrar kullanılabilir özelliktedir. Düzenli temizlik ile 3-6 ay boyunca güvenle kullanabilirsiniz. Hijyen kurallarına uyulduğu sürece ürünün ömrü uzar."
  },
  {
    question: "Yan etkisi var mı?",
    answer: "Oxiva BPA içermeyen, medikal silikon malzemeden üretilmiştir ve dermatolojik testlerden geçmiştir. Ciltte tahriş yapmaz. Ancak mıknatıslı kalp pili kullananların doktorlarına danışması önerilir."
  },
  {
    question: "Uyurken düşer mi?",
    answer: "Hayır, özel mıknatıs teknolojisi sayesinde gece boyunca güvenle yerinde kalır. Yan yatma, sırt üstü yatma gibi pozisyon değişikliklerinde bile düşmez."
  },
  {
    question: "Kargo ve iade süreci nasıl işliyor?",
    answer: "Tüm siparişler aynı gün kargoya verilir ve ortalama 1-3 iş günü içinde teslim edilir. 30 gün boyunca koşulsuz iade garantimiz vardır. Memnun kalmazsanız ücreti iade edilir."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oxiva hakkında merak ettiğiniz her şey
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Başka sorularınız mı var?
          </p>
          <Link 
            href="https://wa.me/905XXXXXXXXX?text=Merhaba, Oxiva hakkında bilgi almak istiyorum."
            target="_blank"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp ile Bize Ulaşın
          </Link>
        </motion.div>
      </div>
    </section>
  )
}