"use client";

import ResponsiveModal from "@/components/responsive-modal";
import EditWorklogForm from "@/features/worklogs/components/EditWorklogForm";
import { useEditWorklogDialog } from "@/features/worklogs/hooks/use-editWorklogDialog";
import { useGetWorklogById } from "@/features/worklogs/api/use-getWorklogById";

function EditWorklogModal() {
  const { worklogId, isOpen, close } = useEditWorklogDialog();

  const { data: worklog, isLoading } = useGetWorklogById({ worklogId });

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && close()}>
      {worklog && !isLoading && (
        <EditWorklogForm worklog={worklog} taskId={worklog.taskId} onCancel={close} />
      )}
    </ResponsiveModal>
  );
}

export default EditWorklogModal;

