"use client";

import { Modal } from "@/components/ui/modal";
import { UserButton } from "@clerk/nextjs";

const SetupPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Modal isOpen onClose={() => {}} title="Setup" description="Setup your account">
        Children
      </Modal>
    </div>
  )
}

export default SetupPage;