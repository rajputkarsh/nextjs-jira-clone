"use client";

import TaskBreadCrumbs from "@/features/tasks/components/TaskBreadcrumbs";
import TaskDescription from "@/features/tasks/components/TaskDescription";
import TaskOverview from "@/features/tasks/components/TaskOverview";
import TaskComments from "@/features/tasks/components/TaskComments";
import TaskWorklogs from "@/features/worklogs/components/TaskWorklogs";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useTranslations } from "next-intl";
import { DottedSeparator } from "@/components/dotter-separator";
import { useGetTasksById } from "@/features/tasks/api/use-getTaskById";
import { useTaskId } from "@/features/tasks/hooks/use-taskId";

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
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskComments task={data} />
        <TaskWorklogs taskId={taskId} />
      </div>
    </div>
  );
}

export default TaskClientPage;
