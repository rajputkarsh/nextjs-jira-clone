import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "@/features/tasks/schema";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string;
  status?: TaskStatus;
  search?: string;
  assigneeId?: string;
  dueDate?: string;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId, projectId, status, search, assigneeId, dueDate },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_tasks");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
