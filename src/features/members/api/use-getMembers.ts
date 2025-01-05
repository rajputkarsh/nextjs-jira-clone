import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_members");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
