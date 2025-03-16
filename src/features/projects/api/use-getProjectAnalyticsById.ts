import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export  type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["analytics"]["$get"], 200>

export const useGetProjectAnalyticsById = ({
  projectId,
}: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_project_analytics");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
