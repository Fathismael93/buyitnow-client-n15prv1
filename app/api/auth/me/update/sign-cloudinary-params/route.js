import { NextResponse } from 'next/server';
import { cloudinary } from '@/backend/utils/cloudinary';

export async function POST(req) {
  const body = await req.json();
  const { paramsToSign } = body;

  // Add the folder parameter to paramsToSign
  paramsToSign.folder = 'buyitnow/avatars';

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET,
  );

  return NextResponse.json({ signature });
}
