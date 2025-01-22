import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.projects['$post']>;
type RequestType = InferRequestType<typeof client.api.projects['$post']>;

export const useCreateProject = () => {

  const translations = useTranslations("CreateProjectForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form });

      if (!response.ok) {
        throw new Error(translations("failed_to_create_new_project"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("project_created"));
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error(translations("failed_to_create_new_project"));
    }
  });

  return mutation;
}