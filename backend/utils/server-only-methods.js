import 'server-only';

import queryString from 'query-string';

export const getAllProducts = async (searchParams) => {
  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page,
    category: (await searchParams).category,
    'price[gte]': (await searchParams).min,
    'price[lte]': (await searchParams).max,
    'ratings[gte]': (await searchParams).ratings,
  };

  const searchQuery = queryString.stringify(urlParams);

  const res = await fetch(`${process.env.API_URL}/api/products?${searchQuery}`);

  await res
    .json()
    .then((result) => {
      console.log('Result');
      console.log(result);
    })
    .catch((err) => {
      console.log('Error');
      console.log(err);
    });

  return [];
};
