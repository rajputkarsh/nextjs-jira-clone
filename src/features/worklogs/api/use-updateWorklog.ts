import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.worklogs[":worklogId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.worklogs[":worklogId"]["$patch"]>;

export const useUpdateWorklog = () => {
  const translations = useTranslations("Worklogs");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType & { taskId: string }>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.worklogs[":worklogId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("failed_to_update_worklog");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(translations("worklog_updated") || "Worklog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["worklogs", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error(translations("failed_to_update_worklog") || "Failed to update worklog");
    }
  });

  return mutation;
};

