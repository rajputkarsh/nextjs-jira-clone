import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.worklogs[":worklogId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.worklogs[":worklogId"]["$delete"]>;

export const useDeleteWorklog = () => {
  const translations = useTranslations("Worklogs");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType & { taskId: string }>({
    mutationFn: async ({ param }) => {
      const response = await client.api.worklogs[":worklogId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("failed_to_delete_worklog");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(translations("worklog_deleted") || "Worklog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["worklogs", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error(translations("failed_to_delete_worklog") || "Failed to delete worklog");
    }
  });

  return mutation;
};

