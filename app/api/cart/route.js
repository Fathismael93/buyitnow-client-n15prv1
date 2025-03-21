import { NextResponse } from 'next/server';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';
import User from '@/backend/models/user';
import Cart from '@/backend/models/cart';
// eslint-disable-next-line no-unused-vars
import Product from '@/backend/models/product';
import ErrorHandler from '@/backend/utils/errorHandler';

export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();
    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return NextResponse.next(new ErrorHandler('User not found', 404));
    }

    let cart;
    const result = await Cart.find({ user: user._id }).populate('product');
    cart = result;

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

export async function POST(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();

    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return NextResponse.next(new ErrorHandler('User not found', 404));
    }

    const body = JSON.parse(req.body);

    const product = await Product.findById(body.productId);

    if (!product) {
      return NextResponse.next(new ErrorHandler('Product not found', 404));
    }

    let quantity = 1;

    // IF QUANTITY ASKED BY THE USER IS MORE THEN THE PRODUCT'STOCK...

    if (quantity > product.stock) {
      return NextResponse.next(new ErrorHandler('Product inavailable', 404));
    }

    const cart = {
      product: product._id,
      user: user._id,
      quantity,
    };

    const cartAdded = await Cart.create(cart);

    return NextResponse.json(
      {
        success: true,
        data: {
          cartAdded,
        },
      },
      { status: 201 },
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
