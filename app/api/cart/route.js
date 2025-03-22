import { NextResponse } from 'next/server';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';
import User from '@/backend/models/user';
import Cart from '@/backend/models/cart';
import Product from '@/backend/models/product';
import ErrorHandler from '@/backend/utils/errorHandler';
import { DECREASE, INCREASE } from '@/helpers/constants';

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
    console.log('WE ARE IN POST ITEM IN CART REQUEST');
    await isAuthenticatedUser(req, NextResponse);

    console.log(
      'WE HAVE CHECKED IF SESSION EXISTS AND WE ARE CONNECTING TO DB',
    );

    dbConnect();

    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return NextResponse.next(new ErrorHandler('User not found', 404));
    }

    console.log('USER EXISTS IN OUR DB');

    console.log(await req.json());

    const body = await req.json();

    console.log('GOT THE BODY FROM REQUEST');

    const product = await Product.findById(body.productId);

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found',
        },
        { status: 404 },
      );
    }

    console.log('PRODUCT IN DB');

    let quantity = 1;

    // IF QUANTITY ASKED BY THE USER IS MORE THEN THE PRODUCT'STOCK...

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          error: 'Product inavailable',
        },
        { status: 404 },
      );
    }

    console.log('STARTING TO ADD THE ITEM');

    const cart = {
      product: product._id,
      user: user._id,
      quantity,
    };

    const cartAdded = await Cart.create(cart);

    console.log('ITEM ADDED AND RETURNING RESPONSE');

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
        error: error,
      },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return NextResponse.next(new ErrorHandler('User not found', 404));
    }

    const body = await req.json();

    const productId = body.product.product._id;
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.next(new ErrorHandler('Product not found', 404));
    }

    // IF THE USER WANT TO INCREASE THE QUANTITY OF A PRODUCT IN THE CART THEN THE VALUE WILL BE INCREASE

    if (body.value === INCREASE) {
      const neededQuantity = body.product.quantity + 1;
      if (neededQuantity > product.stock) {
        return NextResponse.next(new ErrorHandler('Inavailable Quantity', 404));
      }

      const updatedCart = await Cart.findByIdAndUpdate(body.product._id, {
        quantity: neededQuantity,
      });

      if (updatedCart) {
        return NextResponse.json('Item Updated successfully');
      } else {
        return NextResponse.next(
          new ErrorHandler('Unknown error! Try again later', 500),
        );
      }
    }

    // IF THE USER WANT TO DECREASE THE QUANTITY OF A PRODUCT IN THE CART THEN THE VALUE WILL BE DECREASE

    if (body.value === DECREASE) {
      const neededQuantity = body.product.quantity - 1;
      const updatedCart = await Cart.findByIdAndUpdate(body.product._id, {
        quantity: neededQuantity,
      });

      if (updatedCart) {
        return NextResponse.json('Item Updated successfully');
      } else {
        return NextResponse.next(
          new ErrorHandler('Unknown error! Try again later', 500),
        );
      }
    }
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
