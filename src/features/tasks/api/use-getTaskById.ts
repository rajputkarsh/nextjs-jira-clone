import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetTasksByIdProps {
  taskId: string;
}

export const useGetTasksById = ({ taskId }: UseGetTasksByIdProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      taskId
    ],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_task");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
