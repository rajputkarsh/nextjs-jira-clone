import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post'], 200>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]['reset-invite-code']["$post"]
>;

export const useResetInviteCode = () => {
  const translations = useTranslations("ResetInviteCode");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$post"]({
        param,
      });

      if (!response.ok) {
        throw new Error(translations("failed_to_reset_invite_code"));
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(translations("invite_code_reset"));
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error(translations("failed_to_reset_invite_code"));
    },
  });

  return mutation;
}