"use client";

import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";
import { useGetTasks } from "@/features/tasks/api/use-getTasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useQueryState } from "nuqs";
import DataFilters from "@/features/tasks/components/DataFilters";
import { useTaskFilters } from "@/features/tasks/hooks/use-taskFilters";
import { DataTable } from "@/features/tasks/components/DataTable";
import TaskDate from "@/features/tasks/components/TaskDate";
import { ColumnDef } from "@tanstack/react-table";
import { ITask, Task } from "@/features/tasks/schema";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TASK_STATUS } from "@/features/tasks/constants";

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
  const tableTranslations = useTranslations("tasks_table");
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

  const columns: Array<ColumnDef<Task>> = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("task_name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.name;
        return <p className="line-clamp-1">{name}</p>;
      },
    },
    {
      accessorKey: "project",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("project")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const project = row.original.project;
        return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
            <ProjectAvatar
              className="size-6"
              name={project.name}
              image={project.imageUrl}
            />
            <p className="line-clamp-1">{project.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "assignee",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("assignee")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const assignee = row.original.assignee;
        return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
            <MemberAvatar
              className="size-6"
              fallbackClassName="text-xs"
              name={assignee.name}
            />
            <p className="line-clamp-1">{assignee.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("due_date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        return <TaskDate value={dueDate} />;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("status")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status as TASK_STATUS}>{snakeCaseToTitleCase(status)}</Badge>;
      },
    },
  ];

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
              <DataTable
                columns={columns}
                data={
                  tasks?.documents?.length
                    ? (tasks?.documents as unknown as Array<Task>)
                    : []
                }
              />
            </TabsContent>
            <TabsContent value={AVAILABLE_TABS.KANBAN} className="mt-0">
              Data Kanban
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
