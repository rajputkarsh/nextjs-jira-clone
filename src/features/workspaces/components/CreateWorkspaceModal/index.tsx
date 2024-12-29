'use client';

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkSpaceForm from "../CreateWorkspaceForm";

function CreateWorkspaceModal() {
  return (
    <ResponsiveModal open={true} onOpenChange={() => {}}>
      <CreateWorkSpaceForm />
    </ResponsiveModal>
  )
}

export default CreateWorkspaceModal
