import { NextResponse } from 'next/server';
import { turkeyDataService } from '@/utils/turkeyDataService';

export async function GET() {
  try {
    const cities = turkeyDataService.getCities();
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}