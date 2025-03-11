"use client";

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

  return <div>{JSON.stringify(data)}</div>;
}

export default TaskClientPage;
