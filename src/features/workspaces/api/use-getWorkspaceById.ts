import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorkspaceByIdProps {
  workspaceId: string;
}

export const useGetWorkspaceById = ({
  workspaceId,
}: UseGetWorkspaceByIdProps) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed_to_fetch_workspace");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
