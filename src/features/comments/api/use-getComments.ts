import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { CommentWithUser } from "@/features/comments/schema";

interface UseGetCommentsProps {
  taskId: string;
}

export const useGetComments = ({ taskId }: UseGetCommentsProps) => {
  const query = useQuery<CommentWithUser[]>({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const response = await client.api.comments.$get({
        query: { taskId },
      });

      if (!response.ok || response.status >= 400) {
        throw new Error("failed_to_fetch_comments");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!taskId,
  });

  return query;
};

