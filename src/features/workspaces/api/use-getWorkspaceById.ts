import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]['$get'], 200>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$get"]
>;

export const useGetWorkspaceById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$get"]({
        param
      });

      if (!response.ok) {
        throw new Error("failed_to_fetch_workspace");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    }
  });

  return mutation;
}