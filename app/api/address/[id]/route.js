import { NextResponse } from 'next/server';
import Address from '@/backend/models/address';
import isAuthenticatedUser from '@/backend/middlewares/auth';
import dbConnect from '@/backend/config/dbConnect';

export async function GET(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);

    dbConnect();

    const { id } = params;

    const address = await Address.findById(id);

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address not found',
        },
        { status: 200 },
      );
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
      return NextResponse.json(
        {
          success: false,
          error: 'Address not found',
        },
        { status: 200 },
      );
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
      return NextResponse.json(
        {
          success: false,
          error: 'Address not found',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Adress deleted !',
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
