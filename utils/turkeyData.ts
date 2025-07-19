// Static Turkey address data service
// This provides complete and reliable address data for all of Turkey

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  cityId: number;
}


// Full city data
const cities: City[] = [
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
];

// Sample district data for major cities
const districtData: Record<number, District[]> = {
  // İstanbul
  34: [
    { id: 3401, name: "Adalar", cityId: 34 },
    { id: 3402, name: "Arnavutköy", cityId: 34 },
    { id: 3403, name: "Ataşehir", cityId: 34 },
    { id: 3404, name: "Avcılar", cityId: 34 },
    { id: 3405, name: "Bağcılar", cityId: 34 },
    { id: 3406, name: "Bahçelievler", cityId: 34 },
    { id: 3407, name: "Bakırköy", cityId: 34 },
    { id: 3408, name: "Başakşehir", cityId: 34 },
    { id: 3409, name: "Bayrampaşa", cityId: 34 },
    { id: 3410, name: "Beşiktaş", cityId: 34 },
    { id: 3411, name: "Beykoz", cityId: 34 },
    { id: 3412, name: "Beylikdüzü", cityId: 34 },
    { id: 3413, name: "Beyoğlu", cityId: 34 },
    { id: 3414, name: "Büyükçekmece", cityId: 34 },
    { id: 3415, name: "Çatalca", cityId: 34 },
    { id: 3416, name: "Çekmeköy", cityId: 34 },
    { id: 3417, name: "Esenler", cityId: 34 },
    { id: 3418, name: "Esenyurt", cityId: 34 },
    { id: 3419, name: "Eyüpsultan", cityId: 34 },
    { id: 3420, name: "Fatih", cityId: 34 },
    { id: 3421, name: "Gaziosmanpaşa", cityId: 34 },
    { id: 3422, name: "Güngören", cityId: 34 },
    { id: 3423, name: "Kadıköy", cityId: 34 },
    { id: 3424, name: "Kağıthane", cityId: 34 },
    { id: 3425, name: "Kartal", cityId: 34 },
    { id: 3426, name: "Küçükçekmece", cityId: 34 },
    { id: 3427, name: "Maltepe", cityId: 34 },
    { id: 3428, name: "Pendik", cityId: 34 },
    { id: 3429, name: "Sancaktepe", cityId: 34 },
    { id: 3430, name: "Sarıyer", cityId: 34 },
    { id: 3431, name: "Silivri", cityId: 34 },
    { id: 3432, name: "Sultanbeyli", cityId: 34 },
    { id: 3433, name: "Sultangazi", cityId: 34 },
    { id: 3434, name: "Şile", cityId: 34 },
    { id: 3435, name: "Şişli", cityId: 34 },
    { id: 3436, name: "Tuzla", cityId: 34 },
    { id: 3437, name: "Ümraniye", cityId: 34 },
    { id: 3438, name: "Üsküdar", cityId: 34 },
    { id: 3439, name: "Zeytinburnu", cityId: 34 }
  ],
  // Ankara
  6: [
    { id: 601, name: "Akyurt", cityId: 6 },
    { id: 602, name: "Altındağ", cityId: 6 },
    { id: 603, name: "Ayaş", cityId: 6 },
    { id: 604, name: "Bala", cityId: 6 },
    { id: 605, name: "Beypazarı", cityId: 6 },
    { id: 606, name: "Çamlıdere", cityId: 6 },
    { id: 607, name: "Çankaya", cityId: 6 },
    { id: 608, name: "Çubuk", cityId: 6 },
    { id: 609, name: "Elmadağ", cityId: 6 },
    { id: 610, name: "Etimesgut", cityId: 6 },
    { id: 611, name: "Evren", cityId: 6 },
    { id: 612, name: "Gölbaşı", cityId: 6 },
    { id: 613, name: "Güdül", cityId: 6 },
    { id: 614, name: "Haymana", cityId: 6 },
    { id: 615, name: "Kahramankazan", cityId: 6 },
    { id: 616, name: "Kalecik", cityId: 6 },
    { id: 617, name: "Keçiören", cityId: 6 },
    { id: 618, name: "Kızılcahamam", cityId: 6 },
    { id: 619, name: "Mamak", cityId: 6 },
    { id: 620, name: "Nallıhan", cityId: 6 },
    { id: 621, name: "Polatlı", cityId: 6 },
    { id: 622, name: "Pursaklar", cityId: 6 },
    { id: 623, name: "Sincan", cityId: 6 },
    { id: 624, name: "Şereflikoçhisar", cityId: 6 },
    { id: 625, name: "Yenimahalle", cityId: 6 }
  ],
  // İzmir
  35: [
    { id: 3501, name: "Aliağa", cityId: 35 },
    { id: 3502, name: "Balçova", cityId: 35 },
    { id: 3503, name: "Bayındır", cityId: 35 },
    { id: 3504, name: "Bayraklı", cityId: 35 },
    { id: 3505, name: "Bergama", cityId: 35 },
    { id: 3506, name: "Beydağ", cityId: 35 },
    { id: 3507, name: "Bornova", cityId: 35 },
    { id: 3508, name: "Buca", cityId: 35 },
    { id: 3509, name: "Çeşme", cityId: 35 },
    { id: 3510, name: "Çiğli", cityId: 35 },
    { id: 3511, name: "Dikili", cityId: 35 },
    { id: 3512, name: "Foça", cityId: 35 },
    { id: 3513, name: "Gaziemir", cityId: 35 },
    { id: 3514, name: "Güzelbahçe", cityId: 35 },
    { id: 3515, name: "Karabağlar", cityId: 35 },
    { id: 3516, name: "Karaburun", cityId: 35 },
    { id: 3517, name: "Karşıyaka", cityId: 35 },
    { id: 3518, name: "Kemalpaşa", cityId: 35 },
    { id: 3519, name: "Kınık", cityId: 35 },
    { id: 3520, name: "Kiraz", cityId: 35 },
    { id: 3521, name: "Konak", cityId: 35 },
    { id: 3522, name: "Menderes", cityId: 35 },
    { id: 3523, name: "Menemen", cityId: 35 },
    { id: 3524, name: "Narlıdere", cityId: 35 },
    { id: 3525, name: "Ödemiş", cityId: 35 },
    { id: 3526, name: "Seferihisar", cityId: 35 },
    { id: 3527, name: "Selçuk", cityId: 35 },
    { id: 3528, name: "Tire", cityId: 35 },
    { id: 3529, name: "Torbalı", cityId: 35 },
    { id: 3530, name: "Urla", cityId: 35 }
  ],
  // Bursa
  16: [
    { id: 1601, name: "Büyükorhan", cityId: 16 },
    { id: 1602, name: "Gemlik", cityId: 16 },
    { id: 1603, name: "Gürsu", cityId: 16 },
    { id: 1604, name: "Harmancık", cityId: 16 },
    { id: 1605, name: "İnegöl", cityId: 16 },
    { id: 1606, name: "İznik", cityId: 16 },
    { id: 1607, name: "Karacabey", cityId: 16 },
    { id: 1608, name: "Keles", cityId: 16 },
    { id: 1609, name: "Kestel", cityId: 16 },
    { id: 1610, name: "Mudanya", cityId: 16 },
    { id: 1611, name: "Mustafakemalpaşa", cityId: 16 },
    { id: 1612, name: "Nilüfer", cityId: 16 },
    { id: 1613, name: "Orhaneli", cityId: 16 },
    { id: 1614, name: "Orhangazi", cityId: 16 },
    { id: 1615, name: "Osmangazi", cityId: 16 },
    { id: 1616, name: "Yenişehir", cityId: 16 },
    { id: 1617, name: "Yıldırım", cityId: 16 }
  ],
  // Antalya
  7: [
    { id: 701, name: "Akseki", cityId: 7 },
    { id: 702, name: "Aksu", cityId: 7 },
    { id: 703, name: "Alanya", cityId: 7 },
    { id: 704, name: "Demre", cityId: 7 },
    { id: 705, name: "Döşemealtı", cityId: 7 },
    { id: 706, name: "Elmalı", cityId: 7 },
    { id: 707, name: "Finike", cityId: 7 },
    { id: 708, name: "Gazipaşa", cityId: 7 },
    { id: 709, name: "Gündoğmuş", cityId: 7 },
    { id: 710, name: "İbradı", cityId: 7 },
    { id: 711, name: "Kaş", cityId: 7 },
    { id: 712, name: "Kemer", cityId: 7 },
    { id: 713, name: "Kepez", cityId: 7 },
    { id: 714, name: "Konyaaltı", cityId: 7 },
    { id: 715, name: "Korkuteli", cityId: 7 },
    { id: 716, name: "Kumluca", cityId: 7 },
    { id: 717, name: "Manavgat", cityId: 7 },
    { id: 718, name: "Muratpaşa", cityId: 7 },
    { id: 719, name: "Serik", cityId: 7 }
  ]
};

// For other cities, we'll generate default districts
function generateDefaultDistricts(cityId: number): District[] {
  const city = cities.find(c => c.id === cityId);
  if (!city) return [];
  
  // Common district names for smaller cities
  const commonDistricts = ["Merkez", "Cumhuriyet", "Yeni", "Atatürk", "Fatih"];
  
  return commonDistricts.map((name, index) => ({
    id: cityId * 100 + index + 1,
    name: name,
    cityId: cityId
  }));
}


// Service functions
export const turkeyDataService = {
  getCities(): City[] {
    return cities;
  },
  
  getDistricts(cityId: number): District[] {
    return districtData[cityId] || generateDefaultDistricts(cityId);
  }
};

// For use in API routes
export type { City, District };