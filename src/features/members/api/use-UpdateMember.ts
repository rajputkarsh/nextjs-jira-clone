import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useTranslations } from "next-intl";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const translations = useTranslations("UpdateMemberForm");
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error(translations("failed_to_update_member"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("member_updated"));
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error(translations("failed_to_update_member"));
    },
  });

  return mutation;
};
