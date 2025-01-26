import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]['$patch'], 200>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const router = useRouter()
  const translations = useTranslations("UpdateWorkspaceForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param
      });

      if (!response.ok) {
        throw new Error(translations("failed_to_update_workspace"));
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(translations("workspace_updated"));
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data?.$id] });
    },
    onError: () => {
      toast.error(translations("failed_to_update_workspace"));
    }
  });

  return mutation;
}