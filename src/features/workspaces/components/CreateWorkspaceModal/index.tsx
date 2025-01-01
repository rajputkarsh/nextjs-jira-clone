'use client';

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkSpaceForm from "@/features/workspaces/components/CreateWorkspaceForm";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-createWorkspaceModal";

function CreateWorkspaceModal() {

  const {isOpen, setIsOpen, close} = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkSpaceForm onCancel={close} />
    </ResponsiveModal>
  );
}

export default CreateWorkspaceModal
