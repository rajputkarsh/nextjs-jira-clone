import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ResponseType = InferResponseType<typeof client.api.auth['sign-in']['$post']>;
type RequestType = InferRequestType<typeof client.api.auth['sign-in']['$post']>;

export const useLogin = () => {
  const translations = useTranslations("SignInCard");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"]["$post"]({ json });

      if (!response.ok) {
        throw new Error(translations("log_in_failed"));
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("logged_in_successfully"));
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error(translations("failed_to_log_in"));
    }
  });

  return mutation;
}