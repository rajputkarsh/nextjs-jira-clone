"use client";

import ResponsiveModal from "@/components/responsive-modal";
import EditTaskForm from "@/features/tasks/components/EditTaskForm";
import { useEditTaskModal } from "@/features/tasks/hooks/use-editTaskModal";

function EditTaskModal() {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskForm id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
}

export default EditTaskModal;
