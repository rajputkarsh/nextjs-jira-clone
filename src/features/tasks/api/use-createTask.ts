import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['$post']>;

export const useCreateTask = () => {

  const translations = useTranslations("CreateTaskForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['$post']({ json });

      if (!response.ok) {
        throw new Error(translations("failed_to_create_new_task"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("task_created"));
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error(translations("failed_to_create_new_task"));
    }
  });

  return mutation;
}