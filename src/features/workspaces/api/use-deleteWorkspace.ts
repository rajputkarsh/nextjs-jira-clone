import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$delete']>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {

  const translations = useTranslations("DeleteWorkspaceForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error(translations("failed_to_delete_workspace"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("workspace_deleted"));
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error(translations("failed_to_delete_workspace"));
    },
  });

  return mutation;
}