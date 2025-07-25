'use client'

import { usePathname } from 'next/navigation'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import { CartProvider } from "@/context/CartContext"
import InitialLoader from "@/components/ui/InitialLoader"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Admin sayfalarında header, footer ve WhatsApp butonu gösterme
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <InitialLoader />
        {children}
      </>
    )
  }

  return (
    <>
      <InitialLoader />
      <CartProvider>
        <Header />
        <main className="pt-[88px] md:pt-[112px]">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </CartProvider>
    </>
  )
}