import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

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

  if (!store) {
    notFound();
  }

  return (
    <>
      <div>This will be a navbar</div>
      {children}
    </>
  );
}
