import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/schema";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task
}

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  return (
    <div>TaskBreadcrumbs</div>
  )
}

export default TaskBreadcrumbs;
