"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorklogForm from "@/features/worklogs/components/CreateWorklogForm";
import { useWorklogDialog } from "@/features/worklogs/hooks/use-worklogDialog";

function CreateWorklogModal() {
  const { taskId, isOpen, close } = useWorklogDialog();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && close()}>
      {taskId && <CreateWorklogForm taskId={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
}

export default CreateWorklogModal;

