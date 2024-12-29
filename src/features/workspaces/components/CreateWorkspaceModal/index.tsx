'use client';

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkSpaceForm from "../CreateWorkspaceForm";
import { useCreateWorkspaceModal } from "../../hooks/use-createWorkspaceModal";

function CreateWorkspaceModal() {

  const {isOpen, setIsOpen, close} = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkSpaceForm onCancel={close} />
    </ResponsiveModal>
  );
}

export default CreateWorkspaceModal
