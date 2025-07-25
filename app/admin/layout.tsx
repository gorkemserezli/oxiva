'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminEmail, setAdminEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Login sayfası hariç auth kontrolü
    if (pathname !== '/admin/login') {
      const auth = localStorage.getItem('adminAuth')
      if (!auth) {
        router.push('/admin/login')
        return
      }
      
      try {
        const authData = JSON.parse(auth)
        
        // Session expiration kontrolü
        if (authData.expiresAt && new Date(authData.expiresAt) < new Date()) {
          localStorage.removeItem('adminAuth')
          router.push('/admin/login')
          return
        }
        
        setAdminEmail(authData.user?.email || authData.email)
      } catch (error) {
        // Invalid auth data
        localStorage.removeItem('adminAuth')
        router.push('/admin/login')
      }
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    // Cookie'yi temizle
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  // Login sayfasında layout gösterme
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Siparişler', icon: ShoppingCart },
    { href: '/admin/products', label: 'Ürünler', icon: Package },
    { href: '/admin/customers', label: 'Müşteriler', icon: Users },
    { href: '/admin/analytics', label: 'Raporlar', icon: BarChart2 },
    { href: '/admin/settings', label: 'Ayarlar', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600">
            <h1 className="text-white text-xl font-bold">Oxiva Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">{adminEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 bg-primary-600">
                <h1 className="text-white text-xl font-bold">Oxiva Admin</h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'text-white bg-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* User info */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">{adminEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Çıkış Yap"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  )
}