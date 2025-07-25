import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get payment methods and their statuses
    const paymentMethods = await prisma.setting.findMany({
      where: {
        key: {
          in: ['paymentMethods', 'bankAccounts']
        }
      }
    })
    
    const methodsData = paymentMethods.find(s => s.key === 'paymentMethods')
    const bankAccountsData = paymentMethods.find(s => s.key === 'bankAccounts')
    
    const methods = methodsData ? JSON.parse(methodsData.value as string) : { creditCard: false, bankTransfer: false }
    const bankAccounts = bankAccountsData ? JSON.parse(bankAccountsData.value as string) : []
    
    // Only return enabled payment methods
    const availableMethods = []
    
    if (methods.creditCard) {
      availableMethods.push({
        id: 'creditCard',
        name: 'Kredi/Banka Kartı',
        description: 'Güvenli ödeme sistemi ile kartınızla ödeme yapın',
        icon: 'CreditCard'
      })
    }
    
    if (methods.bankTransfer && bankAccounts.length > 0) {
      availableMethods.push({
        id: 'bankTransfer',
        name: 'Havale/EFT',
        description: 'Banka hesabımıza havale veya EFT ile ödeme yapın',
        icon: 'Bank',
        bankAccounts: bankAccounts
      })
    }
    
    return NextResponse.json({
      methods: availableMethods,
      defaultMethod: availableMethods.length > 0 ? availableMethods[0].id : null
    })
    
  } catch (error) {
    console.error('Get payment methods error:', error)
    return NextResponse.json(
      { error: 'Ödeme yöntemleri alınırken hata oluştu' },
      { status: 500 }
    )
  }
}