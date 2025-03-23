import { NextResponse } from 'next/server';
import dbConnect from '@/backend/config/dbConnect';
// eslint-disable-next-line no-unused-vars
import Category from '@/backend/models/category';
import Product from '@/backend/models/product';
import ErrorHandler from '@/backend/utils/errorHandler';

export async function GET(req, { params }) {
  try {
    dbConnect();

    const { id } = params;

    // const product = await Product.findById(id).populate('category');

    const product = false;

    if (!product) {
      return NextResponse.next(new ErrorHandler('Product not found', 404));
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
        message: error,
      },
      { status: 500 },
    );
  }
}
