import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
import Category from '@/backend/models/category';
import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log('We are in the get products get request');
    dbConnect();
    const resPerPage = 2;

    console.log('Checking another way to get req.query');
    console.log(req.nextUrl.searchParams);

    console.log('GET API FILTER AND INVOKE SEARCH AND FILTER');
    const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
      .search()
      .filter();

    console.log('apiFilters: ');
    console.log(apiFilters);

    console.log('GET PRODUCTS FROM API FILTER AFTER SEARCH AND FILTER');
    let products = await apiFilters.query.populate('category');

    console.log('Products searched and filtered');
    console.log(products);

    const filteredProductsCount = products.length;

    console.log('INVOKE PAGINATION FROM API FILTER');
    apiFilters.pagination(resPerPage);

    console.log('GET PRODUCTS FROM API FILTER AFTER PAGINATION');
    products = await apiFilters.query.populate('category').clone();

    const result = filteredProductsCount / resPerPage;
    const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    console.log('GET CATEGORIES FROM DATABASE');
    const categories = await Category.find();

    console.log('RETURN RESPONSE');
    return NextResponse.json(
      {
        success: true,
        data: {
          categories,
          totalPages,
          products,
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
