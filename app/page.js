import React from 'react';
import dynamic from 'next/dynamic';

import { getAllProducts } from '@/backend/utils/server-only-methods';

const ListProducts = dynamic(
  () => import('@/components/products/ListProducts'),
);

export const metadata = {
  title: 'Buy It Now',
};

// eslint-disable-next-line react/prop-types
const HomePage = async ({ searchParams }) => {
  await getAllProducts(await searchParams)
    .then((result) => {
      console.log('result in products page: ');
      console.log(result);
    })
    .catch((error) => {
      console.log('error in products page: ');
      console.log(error);
    });

  return <ListProducts data={[]} />;
};

export default HomePage;
