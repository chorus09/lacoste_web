import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const { productIds, phone, address, isPaid } = body;

    if (!productIds || !productIds.length) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Phone is required", { status: 400 });
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 400 });
    }

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        phone,
        address,
        isPaid: isPaid || false,
        orderItems: {
          create: productIds.map((productId: string) => ({ productId })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.log('[ORDERS_POST]', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const orders = await prismadb.order.findMany({
      where: { storeId: params.storeId },
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log('[ORDERS_GET]', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
