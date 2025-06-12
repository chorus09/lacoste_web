import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const order = await prismadb.order.findUnique({
      where: { id: params.orderId },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json();
    const { phone, address, isPaid } = body;

    const order = await prismadb.order.update({
      where: { id: params.orderId },
      data: {
        phone,
        address,
        isPaid,
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const order = await prismadb.order.delete({
      where: { id: params.orderId },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
