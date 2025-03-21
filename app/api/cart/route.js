import { NextResponse } from 'next/server';
import { isAuthenticatedUser } from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';
import User from '@/backend/models/user';
import Cart from '@/backend/models/cart';
// eslint-disable-next-line no-unused-vars
import Product from '@/backend/models/product';
import ErrorHandler from '@/backend/utils/errorHandler';

export async function GET(req) {
  try {
    console.log('WE ARE IN API/CART');
    await isAuthenticatedUser(req, NextResponse);

    console.log(
      'WE HAVE FINISHED VERIFYING SESSION AND WE ARE CONNECTING DATABASE',
    );

    dbConnect();
    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return NextResponse.next(new ErrorHandler('User not found', 404));
    }

    console.log('USER EXISTS IN OUR DATABASE');

    let cart;
    const result = await Cart.find({ user: user._id }).populate('product');
    cart = result;

    console.log('WE HAVE GOT THE CART FROM THE DATABASE');

    // IF THE QUANTITY HAS EXCEDEED THE PRODUCT STOCK AVAILABLE THEN UPDATE THE QUANTITY TO EQUAL THE PRODUCT STOCK

    for (let index = 0; index < result.length; index++) {
      const productQuantity = result[index].quantity;
      const productStock = result[index].product.stock;
      const id = result[index]._id;

      if (productQuantity > productStock) {
        const cartUpdated = await Cart.findByIdAndUpdate(id, {
          quantity: productStock,
        });

        cart = cartUpdated;
      }
    }

    const cartCount = cart.length;

    console.log('WE ARE RETURNING CART');

    console.log(cartCount);
    console.log(cart);

    return NextResponse.json(
      {
        success: true,
        data: {
          cartCount,
          cart,
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
