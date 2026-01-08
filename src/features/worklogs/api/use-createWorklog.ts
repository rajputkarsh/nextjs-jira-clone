import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.worklogs["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.worklogs["$post"]>;

export const useCreateWorklog = () => {
  const translations = useTranslations("Worklogs");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.worklogs["$post"]({ json });

      if (!response.ok) {
        throw new Error(translations("failed_to_create_worklog"));
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(translations("worklog_created"));
      queryClient.invalidateQueries({ queryKey: ["worklogs", data.taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error(translations("failed_to_create_worklog"));
    },
  });

  return mutation;
};
