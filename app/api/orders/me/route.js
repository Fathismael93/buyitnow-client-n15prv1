import dbConnect from '@/backend/config/dbConnect';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import { NextResponse } from 'next/server';
import Order from '@/backend/models/order';
import APIFilters from '@/backend/utils/APIFilters';
import User from '@/backend/models/user';
import DeliveryPrice from '@/backend/models/deliveryPrice';

export async function GET(req) {
  try {
    console.log(
      'WE ARE IN GET MY ORDERS REQUEST API AND CHECKING IS SESSION ACTIVE',
    );
    await isAuthenticatedUser(req, NextResponse);
    console.log('SESSION IS ACTIVE AND WE ARE CONNECTING TO DATABASE');

    dbConnect();

    console.log('DB IS CONNECTED AND CHECKING USER EXISTENCE IN DB');

    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 },
      );
    }

    console.log('USER EXISTS');

    const resPerPage = 2;
    const ordersCount = await Order.countDocuments({ user: user._id });

    console.log('GOT ORDERS COUNT');

    const apiFilters = new APIFilters(
      Order.find(),
      req?.nextUrl?.pathname,
    ).pagination(resPerPage);

    console.log('PAGINATION IS SET');

    const orders = await apiFilters.query
      .find({ user: user._id })
      .populate('shippingInfo user')
      .sort({ createdAt: -1 });

    const result = ordersCount / resPerPage;
    const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    const deliveryPrice = await DeliveryPrice.find();

    return NextResponse.json(
      {
        success: true,
        data: {
          deliveryPrice,
          totalPages,
          orders,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something is wrong with server! Please try again later',
        error: error,
      },
      { status: 500 },
    );
  }
}
