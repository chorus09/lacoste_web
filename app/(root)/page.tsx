"use client";

import { UserButton } from "@clerk/nextjs";
import { use, useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";


const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Setup Your Account</h1>
      <p className="mt-2">Please fill in the details below to set up your account.</p>
      <UserButton />
    </div>
  )
}

export default SetupPage;