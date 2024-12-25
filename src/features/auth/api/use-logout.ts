import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { useTranslations } from "next-intl";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth['logout']['$post']>;

export const useLogout = () => {

  const translations = useTranslations("auth");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth["logout"]["$post"]();
      return await response.json();
    },
    onSuccess: () => {
      toast.success(translations("logged_out_successfully"));
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error(translations("log_out_failed"));
    },
  });

  return mutation;
}