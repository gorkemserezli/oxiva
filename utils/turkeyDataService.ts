// Turkey data service using turkey.json file
import turkeyData from '@/turkey.json';

export interface City {
  id: number;
  name: string;
  slug: string;
}

export interface District {
  id: number;
  name: string;
  slug: string;
  cityId: number;
}

class TurkeyDataService {
  private static instance: TurkeyDataService;
  private cities: City[] = [];
  private districtsMap: Map<number, District[]> = new Map();

  private constructor() {
    this.initializeData();
  }

  static getInstance(): TurkeyDataService {
    if (!TurkeyDataService.instance) {
      TurkeyDataService.instance = new TurkeyDataService();
    }
    return TurkeyDataService.instance;
  }

  private initializeData() {
    // Initialize cities
    this.cities = turkeyData.map(city => ({
      id: city.plate_code,
      name: city.name,
      slug: city.slug
    }));

    // Initialize districts
    turkeyData.forEach(city => {
      const districts = city.districts.map((district, index) => ({
        id: city.plate_code * 1000 + index + 1,
        name: district.name,
        slug: district.slug,
        cityId: city.plate_code
      }));
      this.districtsMap.set(city.plate_code, districts);
    });
  }

  getCities(): City[] {
    return this.cities;
  }

  getDistricts(cityId: number): District[] {
    return this.districtsMap.get(cityId) || [];
  }

  getCityBySlug(slug: string): City | undefined {
    return this.cities.find(city => city.slug === slug);
  }

  getDistrictBySlug(cityId: number, slug: string): District | undefined {
    const districts = this.districtsMap.get(cityId);
    return districts?.find(district => district.slug === slug);
  }
}

export const turkeyDataService = TurkeyDataService.getInstance();