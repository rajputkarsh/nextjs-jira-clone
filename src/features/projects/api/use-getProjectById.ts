import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjectsProps {
  projectId: string;
}

export const useGetProjects = ({ projectId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_projects");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
