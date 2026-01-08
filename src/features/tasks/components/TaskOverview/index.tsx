import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotter-separator";
import OverviewProperty from "./OverviewProperty";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import TaskDate from "../TaskDate";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";
import { formatEfforts, snakeCaseToTitleCase } from "@/lib/utils";
import { TASK_STATUS } from "@/features/tasks/constants";
import { Task } from "@/features/tasks/schema";
import { useEditTaskModal } from "@/features/tasks/hooks/use-editTaskModal";

interface TaskOverviewProps {
  task: Task;
}

function TaskOverview({ task }: TaskOverviewProps) {
  const translate = useTranslations("Task");

  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{translate("overview")}</p>
          <Button onClick={() => open(task.$id)} size={"sm"} variant={"secondary"}>
            <PencilIcon className="size-4 mr-2" />
            {translate("edit")}
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label={translate("assignee")}>
            <MemberAvatar name={task?.assignee?.name} className="size-6" />
            <p className="text-sm font-medium">{task?.assignee?.name}</p>
          </OverviewProperty>
          <OverviewProperty label={translate("due_date")}>
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label={translate("status")}>
            <Badge variant={task.status as TASK_STATUS}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
          <OverviewProperty label={translate("estimated_efforts")}>
            <p className="text-sm font-medium">{formatEfforts(task?.estimatedEfforts || 0)}</p>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}

export default TaskOverview;
