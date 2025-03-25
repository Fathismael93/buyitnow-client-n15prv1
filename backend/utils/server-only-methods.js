import 'server-only';

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import queryString from 'query-string';
import { getCookieName } from '@/helpers/helpers';
import { toast } from 'react-toastify';
import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
// import Category from '@/backend/models/category';
import APIFilters from '@/backend/utils/APIFilters';

export const getAllProducts = async (searchParams) => {
  try {
    console.log(
      'WE ARE IN THE BEGINNING OF getAllProducts and connecting database',
    );
    dbConnect();

    console.log('urlParams for filtering and pagination');

    let urlParams = {};

    if ((await searchParams).keyword !== undefined) {
      urlParams = { keyword: (await searchParams).keyword, ...urlParams };
    }

    if ((await searchParams).page !== undefined) {
      urlParams = { page: (await searchParams).page, ...urlParams };
    }

    if ((await searchParams).category !== undefined) {
      urlParams = { category: (await searchParams).category, ...urlParams };
    }

    // const urlParams = {
    //   keyword: (await searchParams).keyword,
    //   page: (await searchParams).page,
    //   category: (await searchParams).category,
    //   'price[gte]': (await searchParams).min,
    //   'price[lte]': (await searchParams).max,
    // };

    console.log('Stringify urlParams');
    console.log(urlParams);

    const searchQuery = queryString.stringify(urlParams);
    // const resPerPage = 2;

    console.log('searchQuery: ');
    console.log(searchQuery);

    console.log('Instantiate APIfilter');

    const apiFilters = new APIFilters(
      Product.find(),
      searchQuery ? searchQuery : 'empty',
    )
      .search()
      .filter();

    console.log('get products filtered or searched');

    await apiFilters.query
      .populate('category')
      .then((result) => {
        console.log('result in products page: ');
        const data = result.json();
        console.log(data);
      })
      .catch((error) => {
        console.log('error in products page: ');
        console.log(error);
      });

    // const filteredProductsCount = products.length;

    // console.log('Pagination');

    // apiFilters.pagination(resPerPage);

    // products = await apiFilters.query.populate('category').clone();

    // const result = filteredProductsCount / resPerPage;
    // const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    // console.log('Getting Category products');

    // const categories = await Category.find();

    // console.log('Returning prodcuts and categories');

    // return NextResponse.json(
    //   {
    //     success: true,
    //     data: {
    //       categories,
    //       totalPages,
    //       products,
    //     },
    //   },
    //   { status: 200 },
    // );
  } catch (error) {
    return NextResponse.error(
      {
        success: false,
        message: 'Something is wrong with server! Please try again later',
        error: error,
      },
      { status: 500 },
    );
  }
};

export const getProductDetails = async (id) => {
  const isValidId = mongoose.isValidObjectId(id);

  if (id === undefined || id === null || !isValidId) {
    return notFound();
  }

  const res = await fetch(`${process.env.API_URL}/api/products/${id}`);

  const data = await res.json();

  if (data?.success === false) {
    toast.info(data?.message);
    return [];
  }

  if (data?.product === undefined) {
    return notFound();
  }

  if (data?.error !== undefined) {
    ///////
    return [];
  }

  return data;
};

export const getAllAddresses = async (page) => {
  try {
    const nextCookies = await cookies();
    const nextAuthSessionToken = nextCookies.get(
      '__Secure-next-auth.session-token',
    );

    const res = await fetch(`${process.env.API_URL}/api/address`, {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    });

    const data = await res.json();

    if (data?.success === false) {
      toast.info(data?.message);
      return [];
    }

    if (data?.error !== undefined) {
      ///////
      return [];
    }

    if (page === 'profile') {
      delete data?.data?.paymentTypes;
    }

    return data?.data;
    // eslint-disable-next-line no-unused-vars, no-empty
  } catch (error) {}
};

export const getSingleAddress = async (id) => {
  if (id === undefined || id === null) {
    return notFound();
  }

  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const res = await fetch(`${process.env.API_URL}/api/address/${id}`, {
    headers: {
      Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
    },
  });

  const data = await res.json();

  if (data?.success === false) {
    toast.info(data?.message);
    return [];
  }

  if (data?.error !== undefined) {
    ///////
    return [];
  }

  if (data?.data === undefined) {
    return notFound();
  }

  return data?.data?.address;
};

export const getAllOrders = async (searchParams) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    '__Secure-next-auth.session-token',
  );

  const urlParams = {
    page: (await searchParams)?.page || 1,
  };

  const searchQuery = queryString.stringify(urlParams);

  const res = await fetch(
    `${process.env.API_URL}/api/orders/me?${searchQuery}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  const data = await res.json();

  if (data?.success === false) {
    toast.info(data?.message);
    return [];
  }

  if (data?.error !== undefined) {
    ///////
    return [];
  }

  if (data?.data === undefined) {
    return notFound();
  }

  return data?.data;
};
