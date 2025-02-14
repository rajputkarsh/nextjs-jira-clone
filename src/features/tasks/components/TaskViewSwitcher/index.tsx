"use client";

import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";
import { useGetTasks } from "@/features/tasks/api/use-getTasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useQueryState } from "nuqs";

enum AVAILABLE_TABS {
  TABLE = "TABLE",
  KANBAN = "KANBAN",
  CALENDAR = "CALENDAR",
}

function TaskViewSwitcher() {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: AVAILABLE_TABS.TABLE
  });
  const translations = useTranslations("TaskViewSwitcher");
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full border rounded-lg">
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
        Data Filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value={AVAILABLE_TABS.TABLE} className="mt-0">
            Data Table
          </TabsContent>
          <TabsContent value={AVAILABLE_TABS.KANBAN} className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value={AVAILABLE_TABS.CALENDAR} className="mt-0">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
