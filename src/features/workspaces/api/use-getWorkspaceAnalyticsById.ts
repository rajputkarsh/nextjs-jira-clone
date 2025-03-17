import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorkspaceAnalyticsByIdProps {
  workspaceId: string;
}

export const useGetWorkspaceAnalyticsById = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsByIdProps) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["analytics"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed_to_fetch_workspace_analytics");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
