"use client";

import TaskBreadCrumbs from "@/features/tasks/components/TaskBreadcrumbs";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTasksById } from "@/features/tasks/api/use-getTaskById";
import { useTaskId } from "@/features/tasks/hooks/use-taskId";
import { useTranslations } from "next-intl";

function TaskClientPage() {
  const taskId = useTaskId();
  const translate = useTranslations("task");

  const { data, isLoading } = useGetTasksById({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message={translate("task_not_found")} />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadCrumbs project={data.project} task={data} />
    </div>    
  );
}

export default TaskClientPage;
