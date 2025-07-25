import { NextResponse } from 'next/server'

// Sample districts data for major cities
const districtsData: Record<string, Array<{ id: number; name: string; cityId: number }>> = {
  '34': [ // İstanbul
    { id: 1, name: 'Adalar', cityId: 34 },
    { id: 2, name: 'Arnavutköy', cityId: 34 },
    { id: 3, name: 'Ataşehir', cityId: 34 },
    { id: 4, name: 'Avcılar', cityId: 34 },
    { id: 5, name: 'Bağcılar', cityId: 34 },
    { id: 6, name: 'Bahçelievler', cityId: 34 },
    { id: 7, name: 'Bakırköy', cityId: 34 },
    { id: 8, name: 'Başakşehir', cityId: 34 },
    { id: 9, name: 'Bayrampaşa', cityId: 34 },
    { id: 10, name: 'Beşiktaş', cityId: 34 },
    { id: 11, name: 'Beykoz', cityId: 34 },
    { id: 12, name: 'Beylikdüzü', cityId: 34 },
    { id: 13, name: 'Beyoğlu', cityId: 34 },
    { id: 14, name: 'Büyükçekmece', cityId: 34 },
    { id: 15, name: 'Çatalca', cityId: 34 },
    { id: 16, name: 'Çekmeköy', cityId: 34 },
    { id: 17, name: 'Esenler', cityId: 34 },
    { id: 18, name: 'Esenyurt', cityId: 34 },
    { id: 19, name: 'Eyüpsultan', cityId: 34 },
    { id: 20, name: 'Fatih', cityId: 34 },
    { id: 21, name: 'Gaziosmanpaşa', cityId: 34 },
    { id: 22, name: 'Güngören', cityId: 34 },
    { id: 23, name: 'Kadıköy', cityId: 34 },
    { id: 24, name: 'Kağıthane', cityId: 34 },
    { id: 25, name: 'Kartal', cityId: 34 },
    { id: 26, name: 'Küçükçekmece', cityId: 34 },
    { id: 27, name: 'Maltepe', cityId: 34 },
    { id: 28, name: 'Pendik', cityId: 34 },
    { id: 29, name: 'Sancaktepe', cityId: 34 },
    { id: 30, name: 'Sarıyer', cityId: 34 },
    { id: 31, name: 'Silivri', cityId: 34 },
    { id: 32, name: 'Sultanbeyli', cityId: 34 },
    { id: 33, name: 'Sultangazi', cityId: 34 },
    { id: 34, name: 'Şile', cityId: 34 },
    { id: 35, name: 'Şişli', cityId: 34 },
    { id: 36, name: 'Tuzla', cityId: 34 },
    { id: 37, name: 'Ümraniye', cityId: 34 },
    { id: 38, name: 'Üsküdar', cityId: 34 },
    { id: 39, name: 'Zeytinburnu', cityId: 34 }
  ],
  '6': [ // Ankara
    { id: 40, name: 'Akyurt', cityId: 6 },
    { id: 41, name: 'Altındağ', cityId: 6 },
    { id: 42, name: 'Ayaş', cityId: 6 },
    { id: 43, name: 'Bala', cityId: 6 },
    { id: 44, name: 'Beypazarı', cityId: 6 },
    { id: 45, name: 'Çamlıdere', cityId: 6 },
    { id: 46, name: 'Çankaya', cityId: 6 },
    { id: 47, name: 'Çubuk', cityId: 6 },
    { id: 48, name: 'Elmadağ', cityId: 6 },
    { id: 49, name: 'Etimesgut', cityId: 6 },
    { id: 50, name: 'Evren', cityId: 6 },
    { id: 51, name: 'Gölbaşı', cityId: 6 },
    { id: 52, name: 'Güdül', cityId: 6 },
    { id: 53, name: 'Haymana', cityId: 6 },
    { id: 54, name: 'Kahramankazan', cityId: 6 },
    { id: 55, name: 'Kalecik', cityId: 6 },
    { id: 56, name: 'Keçiören', cityId: 6 },
    { id: 57, name: 'Kızılcahamam', cityId: 6 },
    { id: 58, name: 'Mamak', cityId: 6 },
    { id: 59, name: 'Nallıhan', cityId: 6 },
    { id: 60, name: 'Polatlı', cityId: 6 },
    { id: 61, name: 'Pursaklar', cityId: 6 },
    { id: 62, name: 'Sincan', cityId: 6 },
    { id: 63, name: 'Şereflikoçhisar', cityId: 6 },
    { id: 64, name: 'Yenimahalle', cityId: 6 }
  ],
  '35': [ // İzmir
    { id: 65, name: 'Aliağa', cityId: 35 },
    { id: 66, name: 'Balçova', cityId: 35 },
    { id: 67, name: 'Bayındır', cityId: 35 },
    { id: 68, name: 'Bayraklı', cityId: 35 },
    { id: 69, name: 'Bergama', cityId: 35 },
    { id: 70, name: 'Beydağ', cityId: 35 },
    { id: 71, name: 'Bornova', cityId: 35 },
    { id: 72, name: 'Buca', cityId: 35 },
    { id: 73, name: 'Çeşme', cityId: 35 },
    { id: 74, name: 'Çiğli', cityId: 35 },
    { id: 75, name: 'Dikili', cityId: 35 },
    { id: 76, name: 'Foça', cityId: 35 },
    { id: 77, name: 'Gaziemir', cityId: 35 },
    { id: 78, name: 'Güzelbahçe', cityId: 35 },
    { id: 79, name: 'Karabağlar', cityId: 35 },
    { id: 80, name: 'Karaburun', cityId: 35 },
    { id: 81, name: 'Karşıyaka', cityId: 35 },
    { id: 82, name: 'Kemalpaşa', cityId: 35 },
    { id: 83, name: 'Kınık', cityId: 35 },
    { id: 84, name: 'Kiraz', cityId: 35 },
    { id: 85, name: 'Konak', cityId: 35 },
    { id: 86, name: 'Menderes', cityId: 35 },
    { id: 87, name: 'Menemen', cityId: 35 },
    { id: 88, name: 'Narlıdere', cityId: 35 },
    { id: 89, name: 'Ödemiş', cityId: 35 },
    { id: 90, name: 'Seferihisar', cityId: 35 },
    { id: 91, name: 'Selçuk', cityId: 35 },
    { id: 92, name: 'Tire', cityId: 35 },
    { id: 93, name: 'Torbalı', cityId: 35 },
    { id: 94, name: 'Urla', cityId: 35 }
  ]
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params
    const districts = districtsData[cityId] || []
    
    // If no specific districts, return generic districts
    if (districts.length === 0) {
      return NextResponse.json([
        { id: 1, name: 'Merkez', cityId: parseInt(cityId) },
        { id: 2, name: 'İlçe 1', cityId: parseInt(cityId) },
        { id: 3, name: 'İlçe 2', cityId: parseInt(cityId) },
        { id: 4, name: 'İlçe 3', cityId: parseInt(cityId) }
      ])
    }
    
    return NextResponse.json(districts)
  } catch (error) {
    console.error('Error fetching districts:', error)
    return NextResponse.json(
      { error: 'İlçeler yüklenemedi' },
      { status: 500 }
    )
  }
}