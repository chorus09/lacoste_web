import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";

import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";


const Navbar = async ({ storeId }: { storeId: string} ) => {
   const { userId } = await auth();

   if (!userId) {
      redirect("/sign-in");
   }

   const stores = await prismadb.store.findMany({
      where: {
         userId,
      },
   });

   return (
      <div className="border-b ">
         <div className="flex h-16 items-center px-4">
            <StoreSwitcher items={stores} />
            <MainNav storeId={storeId}/>
            <div className="ml-auto flex items-center space-x-4">
               <ThemeToggle />
               <UserButton afterSignOutUrl="/"/>
            </div>
         </div>
      </div>
   )
}

export default Navbar;