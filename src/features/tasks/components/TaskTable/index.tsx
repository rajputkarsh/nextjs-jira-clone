"use client";

import { useTranslations } from "next-intl";
import { DataTable } from "@/features/tasks/components/DataTable";
import TaskDate from "@/features/tasks/components/TaskDate";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/features/tasks/schema";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { Badge } from "@/components/ui/badge";
import { formatEfforts, snakeCaseToTitleCase } from "@/lib/utils";
import { TASK_STATUS } from "@/features/tasks/constants";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Link, MoreVertical } from "lucide-react";
import TaskActions from "@/features/tasks/components/TaskActions";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useRouter } from "next/navigation";

interface TaskTableProps {
  tasks: Task
}
 
function TaskTable({ tasks }: TaskTableProps) {
  const tableTranslations = useTranslations("tasks_table");
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  
  const handleOpenTask = (id: string) => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }
  
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
        return <p className="line-clamp-1 hover:underline text-primary cursor-pointer" onClick={() => handleOpenTask(row.original.$id)}>{name}</p>
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
        return (
          <Badge variant={status as TASK_STATUS}>
            {snakeCaseToTitleCase(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estimatedEfforts",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("estimated_efforts")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const estimatedEfforts = row.original.estimatedEfforts;
        return <p className="text-sm font-medium">{formatEfforts(estimatedEfforts)}</p>;
      },
    },
    {
      accessorKey: "worklogsTotalEfforts",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {tableTranslations("worklogsTotalEfforts")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const worklogsTotalEfforts = row.original.worklogsTotalEfforts || 0;
        return <p className="text-sm font-medium">{formatEfforts(worklogsTotalEfforts)}</p>;
      },
    },
    {
      id:"actions",
      cell: ({ row }) => {
        const id = row.original.$id;
        const projectId = row.original.projectId;

        return (
          <TaskActions id={id} projectId={projectId}>
            <Button variant={"ghost"} className="size-8 p-0">
              <MoreVertical className="size-4" />
            </Button>
          </TaskActions>
        )
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={
        tasks?.documents?.length
          ? (tasks?.documents as unknown as Array<Task>)
          : []
      }
    />
  );
}

export default TaskTable