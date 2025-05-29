import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });
  console.log(store?.id);
  if (store === null) {
    redirect("/setup"); // ➤ redirecționăm la setup
  }

  redirect(`/${store.id}`); // ➤ redirecționăm la dashboard
}
