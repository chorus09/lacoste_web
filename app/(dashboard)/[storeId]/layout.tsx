import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  console.log(store);
  if (!store) {
    notFound();
  }

  return (
    <>
      <Navbar storeId={params.storeId}/>
      {children}
    </>
  );
}
