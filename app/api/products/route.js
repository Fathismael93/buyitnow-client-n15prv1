import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
// import Category from '@/backend/models/category';
// import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

// eslint-disable-next-line no-unused-vars
export async function GET(_req) {
  try {
    console.log('CONNECTING TO DATABASE');
    dbConnect();

    console.log('We are in the get products get request');
    const resPerPage = 2;

    await Product.find()
      .then((result) => {
        console.log('RESULT FROM DATABASE');
        console.log(result);
      })
      .catch((err) => {
        console.log('ERROR FROM DATABASE');
        console.log(err);
      });

    // console.log('GET API FILTER AND INVOKE SEARCH AND FILTER');
    // new APIFilters(Product.find(), req.query)
    //   .then((result) => {
    //     console.log('RESULT FROM API FILTER');
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log('ERROR FROM API FILTER');
    //     console.log(err);
    //   });

    // console.log('GET PRODUCTS FROM API FILTER AFTER SEARCH AND FILTER');
    // let products = await apiFilters.query.populate('category');
    // const filteredProductsCount = products.length;

    // console.log('INVOKE PAGINATION FROM API FILTER');
    // apiFilters.pagination(resPerPage);

    // console.log('GET PRODUCTS FROM API FILTER AFTER PAGINATION');
    // products = await apiFilters.query.populate('category').clone();

    // const result = filteredProductsCount / resPerPage;
    // const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    // console.log('GET CATEGORIES FROM DATABASE');
    // const categories = await Category.find();

    console.log('RETURN RESPONSE');
    return NextResponse.json(
      {
        success: true,
        data: {
          categories: [],
          totalPages: resPerPage,
          products: [],
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
