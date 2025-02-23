import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { Loader } from "lucide-react";
import TaskForm from "./TaskForm";
import { useGetTasksById } from "@/features/tasks/api/use-getTaskById";
import { ITask } from "@/features/tasks/schema";

interface CreateTaskFormProps {
  id: string;
  onCancel: () => void;
}

function CreateTaskForm({ id, onCancel }: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading: isLoadingTask } = useGetTasksById({ taskId: id });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = (projects?.documents || []).map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = (members?.documents || []).map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!initialValues) {
    return null;
  }

  return (
    <TaskForm
      onCancel={onCancel}
      id={id}
      initialValues={initialValues as unknown as ITask}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
}

export default CreateTaskForm;
