import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-up"]["$post"]({ json });
      return await response.json();
    }
  });

  return mutation;
}