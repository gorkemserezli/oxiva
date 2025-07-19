// Turkey Address Service using PTT API
// PTT API provides all cities, districts and neighborhoods data

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  cityId: number;
}

class AddressService {
  private static instance: AddressService;
  private cities: City[] = [];
  private districts: Map<number, District[]> = new Map();

  private constructor() {}

  static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }
    return AddressService.instance;
  }

  // Get all cities
  async getCities(): Promise<City[]> {
    if (this.cities.length > 0) {
      return this.cities;
    }

    try {
      // Using a proxy or your own backend endpoint to avoid CORS issues
      const response = await fetch('/api/address/cities');
      this.cities = await response.json();
      return this.cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Return hardcoded popular cities as fallback
      return this.getDefaultCities();
    }
  }

  // Get districts by city ID
  async getDistricts(cityId: number): Promise<District[]> {
    if (this.districts.has(cityId)) {
      return this.districts.get(cityId) || [];
    }

    try {
      const response = await fetch(`/api/address/districts/${cityId}`);
      const districts = await response.json();
      this.districts.set(cityId, districts);
      return districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  }


  // Default cities for fallback
  private getDefaultCities(): City[] {
    return [
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
  }
}

export const addressService = AddressService.getInstance();
export type { City, District };