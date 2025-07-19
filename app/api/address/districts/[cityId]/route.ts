import { NextResponse } from 'next/server';
import { turkeyDataService } from '@/utils/turkeyDataService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;
    const cityIdNum = parseInt(cityId);
    const districts = turkeyDataService.getDistricts(cityIdNum);
    return NextResponse.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
}