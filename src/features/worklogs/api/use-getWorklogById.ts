import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorklogByIdProps {
  worklogId: string | null | undefined;
}

export const useGetWorklogById = ({ worklogId }: UseGetWorklogByIdProps) => {
  const query = useQuery({
    queryKey: ["worklog", worklogId],
    queryFn: async () => {
      if (!worklogId) return null;

      const response = await client.api.worklogs[":worklogId"].$get({
        param: { worklogId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_worklog");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!worklogId,
  });

  return query;
};

