import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.comments['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.comments['$post']>;

export const useCreateComment = () => {
  const translations = useTranslations("Task");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.comments.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("failed_to_create_comment");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(translations("comment_added") || "Comment added successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", data.taskId] });
    },
    onError: () => {
      toast.error(translations("failed_to_add_comment") || "Failed to add comment");
    }
  });

  return mutation;
};

