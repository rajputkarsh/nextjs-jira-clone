import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-createTaskModal";
import { Task } from "@/features/tasks/schema";
import { DottedSeparator } from "@/components/dotter-separator";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

interface TaskListProps {
  data: Array<Task>;
  total: number;
}

function TaskList({ data, total }: TaskListProps) {
  const translate = useTranslations("Task");
  const workspaceId = useWorkspaceId();

  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {translate("tasks_total", { total })}
          </p>
          <Button variant={"muted"} size={"icon"} onClick={() => createTask()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data
            .sort((task1, task2) =>
              differenceInMilliseconds(task2.$createdAt, task1.$createdAt)
            )
            .slice(0, 3)
            .map((task) => (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4">
                      <p className="text-lg font-medium truncate">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task?.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300"></div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            {translate("no_tasks_found")}
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            {translate("show_all")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default TaskList;
