"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateTaskForm from "@/features/tasks/components/CreateTaskForm";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";

function CreateTaskModal() {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskForm onCancel={close} />
    </ResponsiveModal>
  );
}

export default CreateTaskModal;
