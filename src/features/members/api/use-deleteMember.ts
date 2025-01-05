import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {

  const translations = useTranslations("DeleteMemberForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error(translations("failed_to_delete_member"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("member_deleted"));
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error(translations("failed_to_delete_member"));
    },
  });

  return mutation;
}