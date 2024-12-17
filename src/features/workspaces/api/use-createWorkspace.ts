import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>;

export const useCreateWorkspace = () => {

  const translations = useTranslations("CreateWorkspaceForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.success(translations("workspace_created"));
      const response = await client.api.workspaces['$post']({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error(translations("failed_to_create_new_workspace"));
    }
  });

  return mutation;
}