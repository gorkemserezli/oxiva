'use client'

import { useEffect, useRef } from 'react'

interface PayTRIframeProps {
  token: string
  onClose?: () => void
}

export default function PayTRIframe({ token, onClose }: PayTRIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    // PayTR iframe mesajlarını dinle
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.paytr.com') return
      
      // PayTR'den gelen mesajları işle
      if (event.data === 'modal_closed') {
        onClose?.()
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onClose])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold">Güvenli Ödeme</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <iframe
            ref={iframeRef}
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            className="w-full"
            style={{ minHeight: '800px' }}
            frameBorder="0"
            scrolling="yes"
          />
        </div>
      </div>
    </div>
  )
}