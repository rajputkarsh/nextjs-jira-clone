"use client";

import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";
import { useGetTasks } from "@/features/tasks/api/use-getTasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useQueryState } from "nuqs";
import DataFilters from "@/features/tasks/components/DataFilters";
import { useTaskFilters } from "@/features/tasks/hooks/use-taskFilters";
import TaskTable from "@/features/tasks/components/TaskTable";
import DataKanban from "@/features/tasks/components/DataKanban";
import { Task } from "@/features/tasks/schema";

enum AVAILABLE_TABS {
  TABLE = "TABLE",
  KANBAN = "KANBAN",
  CALENDAR = "CALENDAR",
}

function TaskViewSwitcher() {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: AVAILABLE_TABS.TABLE,
  });
  const translations = useTranslations("TaskViewSwitcher");
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const [{ status, assigneeId, projectId, search, dueDate }] = useTaskFilters();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status: status ?? undefined,
    assigneeId: assigneeId ?? undefined,
    projectId: projectId ?? undefined,
    search: search ?? undefined,
    dueDate: dueDate ?? undefined,
  });

  if(!tasks) {
    return (
      <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value={AVAILABLE_TABS.TABLE}
            >
              {translations(AVAILABLE_TABS.TABLE.toLowerCase())}
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value={AVAILABLE_TABS.KANBAN}
            >
              {translations(AVAILABLE_TABS.KANBAN.toLowerCase())}
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value={AVAILABLE_TABS.CALENDAR}
            >
              {translations(AVAILABLE_TABS.CALENDAR.toLowerCase())}
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} onClick={open} className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            {translations("new")}
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value={AVAILABLE_TABS.TABLE} className="mt-0">
              <TaskTable tasks={tasks as unknown as Task} />
            </TabsContent>
            <TabsContent value={AVAILABLE_TABS.KANBAN} className="mt-0">
              <DataKanban data={tasks as unknown as Task} />
            </TabsContent>
            <TabsContent value={AVAILABLE_TABS.CALENDAR} className="mt-0">
              Data Calendar
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
