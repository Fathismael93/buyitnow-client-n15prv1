import { NextResponse } from 'next/server';
import dbConnect from '@/backend/config/dbConnect';
// eslint-disable-next-line no-unused-vars
import Category from '@/backend/models/category';
import Product from '@/backend/models/product';

export async function GET(req, { params }) {
  try {
    dbConnect();

    // eslint-disable-next-line no-unused-vars
    const { id } = params;

    // const product = await Product.findById(id).populate('category');

    const product = false;

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product Not found',
        },
        { status: 404 },
      );
    }

    const sameCategoryProducts = await Product.find({
      category: product?.category,
    }).limit(5);

    return NextResponse.json(
      {
        success: true,
        data: {
          product,
          sameCategoryProducts,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      { status: 500 },
    );
  }
}
