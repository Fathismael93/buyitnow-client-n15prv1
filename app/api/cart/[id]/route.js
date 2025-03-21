import User from '@/backend/models/user';
import Cart from '@/backend/models/cart';
import next from 'next';
import ErrorHandler from '@/backend/utils/errorHandler';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const { id } = params;
    const deleteCart = await Cart.findByIdAndDelete(id);

    if (deleteCart) {
      return NextResponse.json(
        {
          success: true,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.error(
        new ErrorHandler('Unknown error! Try again later', 500),
      );
    }
  } catch (error) {
    return NextResponse.error(
      {
        success: false,
        message: error,
      },
      { status: 500 },
    );
  }
}
