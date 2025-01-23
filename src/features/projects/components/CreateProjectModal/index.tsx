'use client';

import ResponsiveModal from "@/components/responsive-modal";
import CreateProjectForm from "@/features/projects/components/CreateProjectForm";
import { useCreateProjectModal } from "@/features/projects/hooks/use-createProjectModal";

function CreateProjectModal() {

  const {isOpen, setIsOpen, close} = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}

export default CreateProjectModal
