import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return default cities for now
    const cities = [
      { id: 1, name: "Adana" },
      { id: 2, name: "Adıyaman" },
      { id: 3, name: "Afyonkarahisar" },
      { id: 4, name: "Ağrı" },
      { id: 5, name: "Amasya" },
      { id: 6, name: "Ankara" },
      { id: 7, name: "Antalya" },
      { id: 8, name: "Artvin" },
      { id: 9, name: "Aydın" },
      { id: 10, name: "Balıkesir" },
      { id: 11, name: "Bilecik" },
      { id: 12, name: "Bingöl" },
      { id: 13, name: "Bitlis" },
      { id: 14, name: "Bolu" },
      { id: 15, name: "Burdur" },
      { id: 16, name: "Bursa" },
      { id: 17, name: "Çanakkale" },
      { id: 18, name: "Çankırı" },
      { id: 19, name: "Çorum" },
      { id: 20, name: "Denizli" },
      { id: 21, name: "Diyarbakır" },
      { id: 22, name: "Edirne" },
      { id: 23, name: "Elazığ" },
      { id: 24, name: "Erzincan" },
      { id: 25, name: "Erzurum" },
      { id: 26, name: "Eskişehir" },
      { id: 27, name: "Gaziantep" },
      { id: 28, name: "Giresun" },
      { id: 29, name: "Gümüşhane" },
      { id: 30, name: "Hakkari" },
      { id: 31, name: "Hatay" },
      { id: 32, name: "Isparta" },
      { id: 33, name: "Mersin" },
      { id: 34, name: "İstanbul" },
      { id: 35, name: "İzmir" },
      { id: 36, name: "Kars" },
      { id: 37, name: "Kastamonu" },
      { id: 38, name: "Kayseri" },
      { id: 39, name: "Kırklareli" },
      { id: 40, name: "Kırşehir" },
      { id: 41, name: "Kocaeli" },
      { id: 42, name: "Konya" },
      { id: 43, name: "Kütahya" },
      { id: 44, name: "Malatya" },
      { id: 45, name: "Manisa" },
      { id: 46, name: "Kahramanmaraş" },
      { id: 47, name: "Mardin" },
      { id: 48, name: "Muğla" },
      { id: 49, name: "Muş" },
      { id: 50, name: "Nevşehir" },
      { id: 51, name: "Niğde" },
      { id: 52, name: "Ordu" },
      { id: 53, name: "Rize" },
      { id: 54, name: "Sakarya" },
      { id: 55, name: "Samsun" },
      { id: 56, name: "Siirt" },
      { id: 57, name: "Sinop" },
      { id: 58, name: "Sivas" },
      { id: 59, name: "Tekirdağ" },
      { id: 60, name: "Tokat" },
      { id: 61, name: "Trabzon" },
      { id: 62, name: "Tunceli" },
      { id: 63, name: "Şanlıurfa" },
      { id: 64, name: "Uşak" },
      { id: 65, name: "Van" },
      { id: 66, name: "Yozgat" },
      { id: 67, name: "Zonguldak" },
      { id: 68, name: "Aksaray" },
      { id: 69, name: "Bayburt" },
      { id: 70, name: "Karaman" },
      { id: 71, name: "Kırıkkale" },
      { id: 72, name: "Batman" },
      { id: 73, name: "Şırnak" },
      { id: 74, name: "Bartın" },
      { id: 75, name: "Ardahan" },
      { id: 76, name: "Iğdır" },
      { id: 77, name: "Yalova" },
      { id: 78, name: "Karabük" },
      { id: 79, name: "Kilis" },
      { id: 80, name: "Osmaniye" },
      { id: 81, name: "Düzce" }
    ]
    
    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Şehirler yüklenemedi' },
      { status: 500 }
    )
  }
}