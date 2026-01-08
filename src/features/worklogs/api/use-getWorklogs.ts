import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorklogsProps {
  taskId: string;
}

export const useGetWorklogs = ({ taskId }: UseGetWorklogsProps) => {
  const query = useQuery({
    queryKey: ["worklogs", taskId],
    queryFn: async () => {
      const response = await client.api.worklogs.$get({
        query: { taskId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_worklogs");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!taskId,
  });

  return query;
};
