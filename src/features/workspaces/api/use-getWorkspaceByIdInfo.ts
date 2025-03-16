import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorkspaceByIdInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceByIdInfo = ({
  workspaceId,
}: UseGetWorkspaceByIdInfoProps) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["info"]["$get"]({
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
