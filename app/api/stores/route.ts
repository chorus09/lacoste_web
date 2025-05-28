import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
   try {
      const { userId } = await auth();
      const body = await request.json();

      const { name } = body;
      if (!name) {
         return new NextResponse('Name is required', {
            status: 400,
         });
      }

      if (!userId) {
         return new NextResponse('Unauthorized', {
            status: 401,
         });
      }

      const store = await prismadb.store.create({
         data: {
            name,
            userId,
         },
      });
      return NextResponse.json(store, {
         status: 201,
      });
   } catch (error) {
      console.log('[STORES_POST]', error);
      return new NextResponse('Internal Server Error', {
         status: 500,
      });
   }
}