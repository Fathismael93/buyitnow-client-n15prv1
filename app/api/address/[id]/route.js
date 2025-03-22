import { NextResponse } from 'next/server';
import Address from '@/backend/models/address';
import ErrorHandler from '@/backend/utils/errorHandler';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';

export async function GET(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();

    const { id } = params;

    const address = await Address.findById(id);

    if (!address) {
      return NextResponse.next(new ErrorHandler('Address not found', 404));
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          address,
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

export async function PUT(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();

    const { id } = params;

    const newAddress = await req.json();

    const oldAddress = await Address.findById(id);

    if (!oldAddress) {
      return NextResponse.next(new ErrorHandler('Address not found', 404));
    }

    const address = await Address.findByIdAndUpdate(id, newAddress, {
      new: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          address,
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

export async function DELETE(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();

    const { id } = params;

    const addressDeleted = await Address.findByIdAndDelete(id);

    if (!addressDeleted) {
      return NextResponse.next(new ErrorHandler('Address not found', 404));
    }

    return NextResponse.json(
      {
        success: true,
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
